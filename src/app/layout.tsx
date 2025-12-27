import type { Metadata } from "next"
import { type ReactNode, ViewTransition } from "react"

import "@/styles/globals.css"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { AmbientLight } from "@/components/ambient-light"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/providers/theme-provider"

export const metadata: Metadata = {
  title: "Library Info",
  description: "Easily get information about dependencies.",
  icons: "/favicon.ico"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="touch-manipulation" lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} antialiased ${GeistMono.variable} flex h-screen max-h-screen flex-col justify-between overscroll-none px-4 font-sans antialiased sm:px-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          <ViewTransition>
            <AmbientLight />
            <main className="mb-8 h-full flex-1">{children}</main>
            <Footer />
          </ViewTransition>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
