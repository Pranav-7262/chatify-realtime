import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, Settings, User, Sparkles } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 transition-all">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group transition-all">
            <div className="relative">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

              {/* The Icon Container */}
              <div className="relative size-10 rounded-xl bg-base-200 flex items-center justify-center border border-primary/20 shadow-sm group-hover:border-primary/50 transition-all">
                <MessageSquare className="size-6 text-primary fill-primary/10 group-hover:scale-110 transition-transform" />
                {/* Micro-sparkle icon */}
                <Sparkles className="absolute -top-1 -right-1 size-3 text-secondary animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chatify
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              to="/settings"
              className="btn btn-sm btn-ghost hover:bg-base-200 gap-2 normal-case font-medium"
            >
              <Settings className="size-4 text-base-content/60" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm btn-ghost hover:bg-base-200 gap-2 normal-case font-medium"
                >
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="size-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-sm btn-ghost text-error/70 hover:text-error hover:bg-error/10 gap-2 normal-case transition-all"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
