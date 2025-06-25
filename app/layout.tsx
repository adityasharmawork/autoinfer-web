import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoInfer - The Tool for Modern Developers",
  description:
    "Effortlessly generate TypeScript interfaces and JSON schemas from any data source. Streamline your workflow with AutoInfer.",
  keywords: "typescript, json schema, code generation, developer tools, api, database, schema inference",
  authors: [{ name: "AutoInfer Team" }],
  openGraph: {
    title: "AutoInfer - The Tool for Modern Developers",
    description: "Effortlessly generate TypeScript interfaces and JSON schemas from any data source.",
    type: "website",
    url: "https://autoinfer.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoInfer - The Tool for Modern Developers",
    description: "Effortlessly generate TypeScript interfaces and JSON schemas from any data source.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en" suppressHydrationWarning>
      <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
