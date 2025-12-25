import { MessageSquare, MessageCircle, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 sm:p-16 bg-base-100/50 backdrop-blur-sm">
      <div className="max-w-md text-center space-y-8">
        {/* Animated Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* Background Glow Effect */}
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />

            {/* Floating Icon Container */}
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 flex items-center justify-center 
              border border-primary/20 shadow-xl backdrop-blur-md
              animate-[bounce_3s_ease-in-out_infinite] hover:scale-110 transition-transform duration-300"
            >
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:rotate-12 transition-transform" />

              {/* Floating "Micro-icons" for extra detail */}
              <div className="absolute -top-2 -right-2 bg-base-100 p-1.5 rounded-full shadow-lg border border-base-300">
                <Sparkles className="w-4 h-4 text-secondary animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Text with Gradient */}
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Chatify
            </span>
          </h2>
          <p className="text-base-content/60 text-lg leading-relaxed max-w-sm mx-auto">
            Select a friend from the sidebar to rediscover the joy of
            <span className="block font-medium text-base-content/80 italic mt-1">
              seamless conversation.
            </span>
          </p>
        </div>

        {/* Action Hint / Visual Divider */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-base-content/20" />
          <MessageCircle className="w-4 h-4 text-base-content/30" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-base-content/20" />
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
