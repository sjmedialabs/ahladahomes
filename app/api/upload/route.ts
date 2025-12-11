import { NextResponse } from "next/server"
import path from "path"
import { writeFile } from "fs/promises"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Read the uploaded file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save locally (in /public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const fileName = `${randomUUID()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${fileName}` // public URL

    // ✅ Always return a valid JSON object
    return NextResponse.json({ url: fileUrl })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
