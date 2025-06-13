import type React from "react"
import AdminClientLayout from "./client-layout"

export const metadata = {
  title: "Admin Dashboard - Batalhão Tático Especial",
  description: "Painel administrativo do Batalhão Tático Especial para GTA Roleplay",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>
}
