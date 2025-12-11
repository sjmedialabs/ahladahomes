import jwt from "jsonwebtoken"
import type { User } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"
const JWT_EXPIRES_IN = "7d"

export interface JWTPayload {
  userId: string
  email: string
  role: User["role"]
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return password
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      console.log("[v0] Comparing password:", password, "with stored:", hashedPassword)

      const isMatch = password === hashedPassword
      console.log("[v0] Password match result:", isMatch)

      return isMatch
    } catch (error) {
      console.log("[v0] Password comparison error:", error)
      return false
    }
  }

  static generateToken(payload: JWTPayload, p0?: string): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }
    return authHeader.substring(7)
  }
}

export function requireAuth(allowedRoles?: User["role"][]) {
  return (req: Request) => {
    const authHeader = req.headers.get("authorization")
    const token = AuthService.extractTokenFromHeader(authHeader)

    if (!token) {
      throw new Error("Authentication required")
    }

    const payload = AuthService.verifyToken(token)
    if (!payload) {
      throw new Error("Invalid or expired token")
    }

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      throw new Error("Insufficient permissions")
    }

    return payload
  }
}
