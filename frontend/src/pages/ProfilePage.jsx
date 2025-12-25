import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Prevent crash if authUser is null while refreshing
  if (!authUser)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-base-content/5 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
            <p className="text-base-content/60 mt-1">
              Manage your account settings
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-primary/20 shadow-xl transition-all group-hover:brightness-90"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary hover:scale-110
                  p-3 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-lg
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="size-5 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest">
              {isUpdatingProfile ? "Uploading..." : "Click to change photo"}
            </p>
          </div>

          {/* Info Section */}
          <div className="grid gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base-content/50 flex items-center gap-2">
                  <User className="size-4" /> Full Name
                </span>
              </label>
              <div className="px-4 py-3 bg-base-200 rounded-xl border border-base-content/5 font-medium">
                {authUser?.fullName}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base-content/50 flex items-center gap-2">
                  <Mail className="size-4" /> Email Address
                </span>
              </label>
              <div className="px-4 py-3 bg-base-200 rounded-xl border border-base-content/5 font-medium">
                {authUser?.email}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-base-200/50 rounded-2xl p-6 border border-base-content/5">
            <h2 className="text-lg font-bold mb-4">Account Metadata</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/60">Member Since</span>
                <span className="font-mono text-sm">
                  {authUser?.createdAt ? (
                    authUser.createdAt.split("T")[0]
                  ) : (
                    <span className="text-base-content/30 italic">
                      Not available
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-base-content/60">Account Status</span>
                <span className="badge badge-success badge-sm gap-1">
                  <div className="size-1.5 rounded-full bg-success-content animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
