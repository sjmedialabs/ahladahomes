import { NextResponse } from "next/server"
import type { AuthResponse } from "@/lib/types"

export async function POST() {
  // Since we're using JWT tokens, logout is handled client-side by removing the token
  // This endpoint exists for consistency and future enhancements (like token blacklisting)

  return NextResponse.json<AuthResponse>({
    success: true,
    message: "Logged out successfully",
  })
}
