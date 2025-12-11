import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ahlada Homes - Best Properties In Hyderabad",
  description: "Find premium homes, apartments, and plots in Hyderabad with trusted guidance from Ahlada Homes.",
  generator: "SJ Media Labs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
