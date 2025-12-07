import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

const deleteAvatar = async (req) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Clear avatar
    user.avatar = "";
    await user.save();

    return NextResponse.json({
      message: "Avatar deleted successfully",
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { message: "Error deleting avatar", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = authMiddleware(deleteAvatar);