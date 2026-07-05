'use client'
import { useEffect, useState } from "react";
import { deleteAvatar, getUserProfile, updateUserProfile } from "../../../services/UserService";
import { useAuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { FaUser, FaPen, FaTrash } from "react-icons/fa";

const UserProfile = () => {
  const { user, setUser } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", avatar: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setForm({
        username: data.username || "",
        email: data.email || "",
        avatar: data.avatar || "",
      });
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setForm({ ...form, avatar: base64 });
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const res = await deleteAvatar();
      setUser(res.user);
      setProfile(res.user);
      setForm((prev) => ({ ...prev, avatar: "" }));
      toast.success("Profile photo deleted successfully");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Failed to delete profile photo");
    }
  };

  const handleSave = async () => {
    try {
      const updates = {};
      if (form.username !== profile.username) updates.username = form.username;
      if (form.email !== profile.email) updates.email = form.email;
      if (form.avatar !== profile.avatar) updates.avatar = form.avatar;

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const { user: updatedUser } = await updateUserProfile(updates);
      setUser(updatedUser);
      setProfile(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (!profile)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-150 p-4">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-6 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="relative group cursor-pointer">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-cyan-400 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-cyan-400 bg-slate-800 shadow-md">
                  <FaUser className="text-5xl text-slate-300" />
                </div>
              )}

              {isEditing && (
                <>
                  <label className="absolute bottom-2 right-12 cursor-pointer rounded-full bg-cyan-500 p-2 text-sm text-white shadow-md transition hover:bg-cyan-400">
                    <FaPen size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />
                  </label>

                  {form.avatar && (
                    <button
                      onClick={handleDeletePhoto}
                      className="absolute bottom-2 right-2 rounded-full bg-red-600 p-2 text-white shadow-md transition hover:bg-red-500"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </>
              )}
            </div>

            <div>
              {!isEditing ? (
                <h2 className="text-3xl font-semibold text-white">{profile.username}</h2>
              ) : (
                <input
                  type="text"
                  value={form.username}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-center text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              )}

              {!isEditing ? (
                <p className="mt-2 text-slate-300">{profile.email}</p>
              ) : (
                <input
                  type="email"
                  value={form.email}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-center text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm(profile);
                  }}
                  className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-white">Profile Details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Username</p>
              <p className="mt-1 font-medium text-white">{profile.username}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Email</p>
              <p className="mt-1 font-medium text-white">{profile.email}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-300 ">
            Manage your profile settings and personal information here
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;