// /app/api/general-enquiry/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, subject } = await req.json()
    console.log(
      "contact from emial", email, name, phone, message
    )
    // configure transporter (use your SMTP / Gmail credentials)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL, // e.g., your company's email
        pass: process.env.CONTACT_PASS,
      },
    })

    const mailOptions = {
      from: email,
      replyTo: email,
      to: process.env.CONTACT_EMAIL,
      subject: subject || "New Enquiry Form Submission",
      text: `
New enquiry received from BNR Homes contact form:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `,
    }
    console.log("mailOptions", mailOptions)
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Mail sent successfully" })
  } catch (error) {
    console.error("Error sending general enquiry:", error)
    return NextResponse.json({ error: "Failed to send mail" }, { status: 500 })
  }
}
