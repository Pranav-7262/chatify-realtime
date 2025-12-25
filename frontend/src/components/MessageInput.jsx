import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 w-full bg-base-100/50 backdrop-blur-lg border-t border-base-300">
      {/* Image Preview Popup */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-xl border-2 border-primary shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300 shadow-md
              flex items-center justify-center hover:bg-error hover:text-white transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 max-w-7xl mx-auto"
      >
        <div className="flex-1 flex gap-2 items-center bg-base-200 rounded-2xl px-3 py-1.5 focus-within:ring-2 ring-primary/20 transition-all">
          {/* Image Upload Toggle */}
          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-sm
              ${imagePreview ? "text-emerald-500" : "text-base-content/50"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Text Input */}
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm h-10 py-2"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className={`btn btn-circle btn-primary shadow-md transition-all ${
            !text.trim() && !imagePreview
              ? "opacity-50 cursor-not-allowed scale-95"
              : "hover:scale-105"
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send
            size={20}
            className={
              text.trim() || imagePreview
                ? "translate-x-0.5 -translate-y-0.5"
                : ""
            }
          />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
