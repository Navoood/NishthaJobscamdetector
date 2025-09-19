import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Job Scam Detector - AI-Powered Protection for Job Seekers",
  description:
    "Instantly detect fraudulent job postings with our AI-powered analysis. Protect yourself from scams with detailed explanations and risk scoring.",
  generator: "v0.app",
  keywords: ["job scam", "fraud detection", "AI analysis", "job security", "employment protection"],
  authors: [{ name: "AI Hackathon MVP Team" }],
  openGraph: {
    title: "Job Scam Detector - AI-Powered Protection",
    description: "Instantly detect fraudulent job postings with AI analysis",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
