import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/styles/globals.css"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { AmbientLight } from "@/components/ambient-light"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/providers/theme-provider"

export const metadata: Metadata = {
  title: {
    default: "Library Info",
    template: "%s | Library Info"
  },
  description: "Easily get information about dependencies.",
  applicationName: "Library Info",
  icons: {
    icon: "/favicon.ico"
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="touch-manipulation" lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex h-dvh flex-col overflow-hidden overscroll-none px-4 font-sans antialiased sm:px-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          <AmbientLight />
          <main className="min-h-0 w-full flex-1 overflow-hidden py-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
