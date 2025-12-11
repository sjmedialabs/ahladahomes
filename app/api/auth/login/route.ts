import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/User";
import { AuthService } from "@/lib/auth";
import type { LoginCredentials, AuthResponse, User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Fetch user from DB and keep _id for internal operations
    const userFromDB = (await UserModel.findOne({ email }).lean()) as (User & { _id: any }) | null;

    if (!userFromDB) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (userFromDB.status !== "active") {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Account is inactive or suspended",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await AuthService.comparePassword(
      password,
      userFromDB.password!
    );

    if (!isPasswordValid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Update last login
    await UserModel.findByIdAndUpdate(userFromDB._id, {
      lastLogin: new Date().toISOString(),
    });

    // Generate JWT token
    const token = AuthService.generateToken({
      userId: userFromDB._id.toString(),
      email: userFromDB.email,
      role: userFromDB.role,
    });

    // Map _id to id for API response
    const { password: _, ...userWithoutPassword } = userFromDB;
    const userResponse: User = {
      ...userWithoutPassword,
      id: userFromDB._id.toString(),
    };

    return NextResponse.json<AuthResponse>({
      success: true,
      user: userResponse,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
