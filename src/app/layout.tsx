import type { Metadata } from "next"

import "@/styles/globals.css"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"

import { AmbientLight } from "@/components/ambient-light"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Library Info",
  description: "Easily get information about dependencies.",
  icons: "/favicon.ico"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={inter.variable} lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} h-[calc(100vh-6vh)] overflow-x-hidden antialiased lg:h-[calc(100vh-9vh)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          <AmbientLight />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
