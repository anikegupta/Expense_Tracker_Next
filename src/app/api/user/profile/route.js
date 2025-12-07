import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

// ✅ Get current user profile
const getProfile = async (req) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId).select("username email avatar");
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get profile", error: error.message },
      { status: 500 }
    );
  }
};

// ✅ Update only provided fields
const updateProfile = async (req) => {
  try {
    await connectDB();
    const { username, email, avatar } = await req.json();

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("username email avatar");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
};

export const GET = authMiddleware(getProfile);
export const PUT = authMiddleware(updateProfile);