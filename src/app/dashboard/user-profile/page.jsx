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
    <div className="min-h-screen bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col items-center py-10 px-4">
      {/* Profile Card */}
      <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-6 w-full max-w-lg flex flex-col items-center">
        <div className="relative group">
          {form.avatar ? (
            <img
              src={form.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-400 object-cover shadow-md"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-blue-400 bg-gray-700 shadow-md">
              <FaUser className="text-5xl text-gray-300" />
            </div>
          )}

          {isEditing && (
            <>
              <label className="absolute bottom-2 right-12 bg-blue-600 hover:bg-blue-700 text-white text-sm p-2 rounded-full cursor-pointer shadow-md">
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
                  className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Username */}
        {!isEditing ? (
          <h2 className="text-2xl font-semibold mt-4">{profile.username}</h2>
        ) : (
          <input
            type="text"
            value={form.username}
            className="mt-4 p-2 rounded-lg w-60 text-center text-black"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        )}

        {/* Email */}
        {!isEditing ? (
          <p className="text-gray-300">{profile.email}</p>
        ) : (
          <input
            type="email"
            value={form.email}
            className="mt-2 p-2 rounded-lg w-60 text-center text-black"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm(profile);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-10 text-gray-300 text-sm">
        Manage your profile settings & personal info.
      </p>
    </div>
  );
};

export default UserProfile;