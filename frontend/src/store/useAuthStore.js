import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { io } from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE == "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL || "/";

import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false, // it means we are in the process of signing up
  isLoggingIn: false, // it means we are in the process of logging in
  isUpdatingProfile: false, // it means we are in the process of updating profile
  isCheckingAuth: true, // it means we are checking auth status
  onlineUsers: [], // Placeholder for online users logic
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // res.data will now be the USER object directly, not { user: ... }
      set({ authUser: res.data });
      // reconnect socket after successful auth restore
      get().connectSocket();
      // restore selected chat after auth is restored
      try {
        useChatStore.getState().restoreSelectedFromLocalStorage();
      } catch (err) {
        console.warn("restoreSelectedFromLocalStorage failed:", err);
      }
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true }); // start signing up
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data }); // set the authUser with the data received
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isSigningUp: false }); // end signing up
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true }); // start logging in
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data }); // set the authUser with the data received
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoggingIn: false }); // end logging in
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch {
      toast.error("Error logging out");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true }); // start updating profile
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false }); // end updating profile
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: async () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    } else {
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
