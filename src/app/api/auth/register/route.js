import { NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    const user = await User.create({
      username,
      email,
      password,
    });

    return NextResponse.json(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
        property: err.path,
        errorValue: err.message,
      }));
      return NextResponse.json(errors, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}