import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import type { AuthResponse, User } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const payload = requireAuth()(request);

    await connectDB();

    // ✅ Cast lean() result to User & { _id: any } | null
    const userFromDB = (await UserModel.findById(payload.userId).lean()) as (User & { _id: any }) | null;
    // const user = await User.findById(payload.userId).lean(); // original

    if (!userFromDB) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userFromDB;

    // Map _id → id for API response
    const userResponse: User = {
      ...userWithoutPassword,
      id: userFromDB._id.toString(),
    };

    return NextResponse.json<AuthResponse>({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    console.error("Get user error:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
