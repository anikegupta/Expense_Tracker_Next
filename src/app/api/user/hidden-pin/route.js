import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/middleware/auth";

async function handler(req) {
  try {
    await connectDB();

    const user = await User.findById(req.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();

    const action = body.action;

    // ==========================
    // CHECK WHETHER PIN EXISTS
    // ==========================
    if (action === "status") {
      return NextResponse.json({
        success: true,
        hasPin: !!user.hiddenExpensePin,
      });
    }

    // ==========================
    // CREATE / VERIFY PIN
    // ==========================
    if (action === "verify") {
      const { pin } = body;

      if (!/^\d{4}$/.test(pin)) {
        return NextResponse.json(
          {
            success: false,
            message: "PIN must contain exactly 4 digits",
          },
          { status: 400 }
        );
      }

      // First time → Create PIN
      if (!user.hiddenExpensePin) {
        user.hiddenExpensePin = pin;
        await user.save();

        return NextResponse.json({
          success: true,
          mode: "created",
          message: "PIN created successfully",
        });
      }

      // Verify existing PIN
      const matched = await bcrypt.compare(
        pin,
        user.hiddenExpensePin
      );

      if (!matched) {
        return NextResponse.json(
          {
            success: false,
            message: "Incorrect PIN",
          },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        mode: "verified",
        message: "PIN verified successfully",
      });
    }

    // ==========================
    // CHANGE PIN
    // ==========================
    if (action === "change") {
      const { currentPin, newPin } = body;

      if (!/^\d{4}$/.test(currentPin)) {
        return NextResponse.json(
          {
            success: false,
            message: "Current PIN must contain exactly 4 digits",
          },
          { status: 400 }
        );
      }

      if (!/^\d{4}$/.test(newPin)) {
        return NextResponse.json(
          {
            success: false,
            message: "New PIN must contain exactly 4 digits",
          },
          { status: 400 }
        );
      }

      if (!user.hiddenExpensePin) {
        return NextResponse.json(
          {
            success: false,
            message: "PIN not created yet",
          },
          { status: 400 }
        );
      }

      const matched = await bcrypt.compare(
        currentPin,
        user.hiddenExpensePin
      );

      if (!matched) {
        return NextResponse.json(
          {
            success: false,
            message: "Current PIN is incorrect",
          },
          { status: 401 }
        );
      }

      user.hiddenExpensePin = newPin;

      await user.save();

      return NextResponse.json({
        success: true,
        mode: "updated",
        message: "PIN updated successfully",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 }
    );

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(handler);