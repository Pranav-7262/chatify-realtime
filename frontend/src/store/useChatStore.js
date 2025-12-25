import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  // initial selected user; restore only after auth check
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  // UI state
  mobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

  // internal refs
  _messageHandler: null,
  _subscribeRetryTimer: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No chat selected");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  clearChat: async () => {
    const { selectedUser, isClearingChat } = get();
    if (!selectedUser || isClearingChat) return;

    set({ isClearingChat: true });

    try {
      await axiosInstance.delete(`/messages/clear/${selectedUser._id}`);

      set({ messages: [] });
      toast.success("Chat cleared");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to clear chat");
    } finally {
      set({ isClearingChat: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    // If socket is not available or not connected yet, retry a few times
    if (!socket || !socket.connected) {
      // avoid creating multiple retry timers
      if (get()._subscribeRetryTimer) return;
      const timer = setInterval(() => {
        const s = useAuthStore.getState().socket;
        if (s && s.connected) {
          clearInterval(get()._subscribeRetryTimer);
          set({ _subscribeRetryTimer: null });
          get().subscribeToMessages();
        }
      }, 200);
      // stop retry after 10s
      setTimeout(() => {
        clearInterval(timer);
        if (get()._subscribeRetryTimer === timer)
          set({ _subscribeRetryTimer: null });
      }, 10000);
      set({ _subscribeRetryTimer: timer });
      return;
    }

    // remove previous handler if exists to avoid duplicates
    const prevHandler = get()._messageHandler;
    if (prevHandler) {
      socket.off("newMessage", prevHandler);
      set({ _messageHandler: null });
    }

    const handler = (newMessage) => {
      const isMessageFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    };

    socket.on("newMessage", handler);
    set({ _messageHandler: handler });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    // clear any retry timer
    if (get()._subscribeRetryTimer) {
      clearInterval(get()._subscribeRetryTimer);
      set({ _subscribeRetryTimer: null });
    }
    if (!socket) return;
    const handler = get()._messageHandler;
    if (handler) {
      socket.off("newMessage", handler);
      set({ _messageHandler: null });
    } else {
      // safe fallback: remove all handlers for that event
      socket.off("newMessage");
    }
  },

  setSelectedUser: async (selectedUser) => {
    const prev = get().selectedUser;
    if (prev && selectedUser && prev._id === selectedUser._id) return;

    if (selectedUser) {
      localStorage.setItem("chat-selectedUser", JSON.stringify(selectedUser));
      // close mobile sidebar when a chat is selected on mobile
      set({ selectedUser, messages: [], mobileSidebarOpen: false });
      try {
        await get().getMessages(selectedUser._id);
      } catch (err) {
        console.warn("getMessages failed:", err);
      }
      // ensure one subscription
      get().unsubscribeFromMessages();
      get().subscribeToMessages();
    } else {
      localStorage.removeItem("chat-selectedUser");
      get().unsubscribeFromMessages();
      set({ selectedUser: null, messages: [] });
    }
  },

  restoreSelectedFromLocalStorage: () => {
    const _stored = JSON.parse(
      localStorage.getItem("chat-selectedUser") || "null"
    );
    if (!_stored) return;
    // setSelectedUser will fetch messages and try to subscribe (safe if socket not ready)
    get().setSelectedUser(_stored);
  },
}));
