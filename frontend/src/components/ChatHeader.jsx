import { X, Trash2, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat, isClearingChat, messages } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser?._id);

  const handleClearChat = () => {
    if (!selectedUser) return;
    const confirmed = window.confirm(
      "Are you sure you want to clear this chat?"
    );
    if (confirmed) clearChat();
  };

  return (
    <div className="p-3 border-b border-base-300 bg-base-100/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Section with Online Indicator */}
          <div className="relative">
            <div className="avatar">
              <div className="size-10 rounded-full ring-2 ring-base-300 ring-offset-base-100 ring-offset-2">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="object-cover"
                />
              </div>
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-base-100 rounded-full"></span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${
                  isOnline ? "bg-green-500 animate-pulse" : "bg-base-content/30"
                }`}
              />
              <p className="text-xs text-base-content/60 font-medium">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              disabled={isClearingChat}
              className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10 transition-colors"
              title="Clear chat"
            >
              {isClearingChat ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}

          <div className="divider divider-horizontal mx-0 w-1 opacity-50"></div>

          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-colors"
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
