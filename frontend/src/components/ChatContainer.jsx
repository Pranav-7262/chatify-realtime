import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react"; // Added useState
import { ChevronDown } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageDateTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);
  const scrollContainerRef = useRef(null); // Ref for the scrollable area
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Scroll function logic
  const scrollToBottom = (behavior = "smooth") => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages]);

  // Monitor scroll position
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Show button if user is more than 300px from the bottom
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollButton(isFarFromBottom);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100/50 relative">
      <ChatHeader />

      {/* Scrollable Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative"
      >
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSentByMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border border-base-300">
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-[10px] opacity-50 ml-1">
                  {formatMessageDateTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`chat-bubble flex flex-col gap-2 p-3 shadow-sm ${
                  isSentByMe ? "bg-primary text-primary-content" : "bg-base-200"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-[200px] rounded-md"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} className="h-2" />
      </div>

      {/* Floating Scroll Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-24 right-8 z-20 p-2 rounded-full bg-primary text-primary-content shadow-lg hover:scale-110 transition-all animate-bounce"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={20} />
        </button>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
