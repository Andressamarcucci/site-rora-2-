"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Users, Award, Shirt, Car, LogOut, Home, User, BookOpen, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCheck } from "@/components/auth-check"
import { ToastProvider } from "@/components/ui/use-toast"
import { Toaster } from "sonner"
import type { User as UserType } from "@/lib/types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    // Carregar informações do usuário atual
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  return (
    <AuthCheck redirectTo="/login">
      <ToastProvider>
        <SidebarProvider>
          <div className="flex min-h-screen bg-rota-black">
            <Sidebar className="border-r border-rota-darkgold">
              <SidebarHeader className="border-b border-rota-darkgold">
                <div className="flex flex-col items-center gap-2 px-4 py-4">
                  <div className="relative h-24 w-24">
                    <Image
                      src="/images/rota-dignidade.png"
                      alt="ROTA - Rondas Ostensivas Tobias de Aguiar"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h1 className="text-lg font-bold text-rota-gold">Batalhão Tático</h1>
                    <p className="text-xs text-rota-darkgold">Área do Policial</p>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/dashboard" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/perfil" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard/perfil" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <User className="h-4 w-4" />
                        <span>Meu Perfil</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/hierarquias" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard/hierarquias" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <Award className="h-4 w-4" />
                        <span>Hierarquias</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/fardamentos" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard/fardamentos" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <Shirt className="h-4 w-4" />
                        <span>Fardamentos</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/viaturas" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard/viaturas" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <Car className="h-4 w-4" />
                        <span>Viaturas</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/cursos" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard/cursos" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <GraduationCap className="h-4 w-4" />
                        <span>Cursos</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/membros" passHref legacyBehavior>
                      <a className={`flex items-center gap-2 w-full rounded-md p-2 text-sm transition-colors ${pathname === "/dashboard/membros" ? "bg-rota-gray text-[#ffbf00] font-bold" : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"}`}>
                        <Users className="h-4 w-4" />
                        <span>Membros</span>
                      </a>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="border-t border-rota-darkgold">
                <div className="p-4">
                  {currentUser && (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-rota-gray flex-shrink-0 flex items-center justify-center">
                        {currentUser.avatar ? (
                          <Image
                            src={currentUser.avatar}
                            alt={currentUser.name || "Usuário"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-rota-gold" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-rota-gold truncate">{currentUser.name}</p>
                        <p className="text-xs text-rota-darkgold truncate">{currentUser.rank || "Policial"}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-rota-gold hover:bg-rota-gray"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Sair</span>
                      </Button>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="flex items-center justify-center w-full mx-4 mb-4 border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Deslogar</span>
                </Button>
              </SidebarFooter>
            </Sidebar>

            <div className="flex-1 w-full h-[calc(100vh-2rem)] overflow-hidden">
              <header className="h-16 border-b border-rota-darkgold">
                <div className="flex h-full items-center justify-between px-6">
                  <h1 className="text-lg font-bold text-[#ffbf00]">
                    Batalhão Tático Especial - Área do Policial
                  </h1>
                </div>
              </header>
              
              <div className="p-6 h-[calc(100vh-8rem)] overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </SidebarProvider>
        <Toaster richColors position="top-right" />
      </ToastProvider>
    </AuthCheck>
  )
}
