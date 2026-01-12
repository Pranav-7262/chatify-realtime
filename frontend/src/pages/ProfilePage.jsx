import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Check, Edit2, X, Trash } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteUser } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // New State for editing text fields
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");

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

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (fullName.trim() === authUser?.fullName) return setIsEditing(false);

    await updateProfile({ fullName: fullName.trim() });
    setIsEditing(false);
  };

  if (!authUser)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (deleteConfirmText === "DELETE") {
      await deleteUser();
    }
  };
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
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary/20 shadow-xl transition-all group-hover:brightness-90"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary hover:scale-110 p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-primary-content" />
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
          <form onSubmit={handleUpdateName} className="grid gap-6">
            <div className="form-control w-full">
              <label className="label flex justify-between">
                <span className="label-text text-base-content/50 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </span>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border border-base-content/5 font-medium transition-all ${
                    isEditing
                      ? "bg-base-100 border-primary focus:outline-none ring-2 ring-primary/20"
                      : "bg-base-200 cursor-not-allowed"
                  }`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing || isUpdatingProfile}
                />

                {isEditing && (
                  <div className="absolute right-2 flex gap-1">
                    <button
                      type="submit"
                      className="btn btn-ghost btn-sm btn-circle text-success"
                      disabled={isUpdatingProfile}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFullName(authUser.fullName);
                      }}
                      className="btn btn-ghost btn-sm btn-circle text-error"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base-content/50 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </span>
              </label>
              <div className="px-4 py-3 bg-base-200 rounded-xl border border-base-content/5 font-medium opacity-70">
                {authUser?.email}
              </div>
              <p className="text-[10px] text-base-content/40 mt-1 ml-1 italic">
                Email address cannot be changed.
              </p>
            </div>
          </form>

          {/* Stats Section */}
          <div className="bg-base-200/50 rounded-2xl p-6 border border-base-content/5">
            <h2 className="text-lg font-bold mb-4">Account Metadata</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/60">Member Since</span>
                <span className="font-mono text-sm">
                  {authUser?.createdAt?.split("T")[0] || "Not available"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-base-content/60">Account Status</span>
                <span className="badge badge-success badge-sm gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success-content animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
          {/* Danger Zone */}
          <div className="mt-8 pt-6 border-t border-error/20">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors w-full justify-center font-medium"
              >
                <Trash className="w-4 h-4" />
                Delete Account
              </button>
            ) : (
              <div className="bg-error/5 border border-error/20 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-error font-bold">
                      Delete Permanent Account
                    </h3>
                    <p className="text-xs text-base-content/60 mt-1">
                      This action is irreversible. All data will be wiped.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm">
                    Type <span className="font-bold text-error">DELETE</span> to
                    confirm:
                  </p>
                  <input
                    type="text"
                    placeholder="DELETE"
                    className="input input-bordered input-error w-full bg-base-100"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                    className="btn btn-error w-full text-white disabled:opacity-50"
                  >
                    I understand, delete my account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
