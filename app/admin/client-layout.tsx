"use client"

import type React from "react"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { inter } from "@/lib/fonts"
import { AuthCheck } from "@/components/admin-auth-check"

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} bg-black text-white antialiased dark`} data-layout="admin">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthCheck adminOnly={true}>
          {children}
        </AuthCheck>
      </ThemeProvider>
    </div>
  )
}