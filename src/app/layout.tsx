import type { Metadata } from "next"

import "@/styles/globals.css"

import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"

import { AmbientLight } from "@/components/ambient-light"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Library Info",
  description: "Easily get information about dependencies.",
  icons: "/favicon.ico",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} overflow-hidden antialiased h-[calc(100dvh-6dvh)] lg:h-[calc(100dvh-10dvh)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AmbientLight />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
