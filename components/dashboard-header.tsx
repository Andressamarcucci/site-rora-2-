"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { User, Bell, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserType = {
  name: string
  email: string
  role: string
  avatarUrl?: string | null
}

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isSidebarAvailable, setIsSidebarAvailable] = useState(false)

  useEffect(() => {
    // Verificar se o componente está dentro de um SidebarProvider
    try {
      // Se não estiver dentro de um SidebarProvider, isso lançará um erro
      // que será capturado pelo catch
      const sidebarElement = document.querySelector('[data-sidebar="sidebar"]')
      setIsSidebarAvailable(!!sidebarElement)
    } catch (error) {
      setIsSidebarAvailable(false)
    }

    // Obter informações do usuário do localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Função para obter o título da página com base no pathname
  const getPageTitle = () => {
    const path = pathname.split("/").pop()

    switch (path) {
      case "dashboard":
        return "Dashboard"
      case "membros":
        return "Gestão de Membros"
      case "hierarquias":
        return "Gestão de Hierarquias"
      case "fardamentos":
        return "Gestão de Fardamentos"
      case "viaturas":
        return "Gestão de Viaturas"
      case "perfil":
        return "Meu Perfil"
      default:
        return "Dashboard"
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const navigateToProfile = () => {
    router.push("/dashboard/perfil")
  }

  return (
    <header className="border-b border-police-lightgray bg-police-darkblue">
      <div className="flex h-16 items-center px-4">
        {isSidebarAvailable && <SidebarTrigger className="mr-2 md:hidden" />}

        <div className="flex-1">
          <h1 className="text-xl font-bold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-police-red"></span>
            <span className="sr-only">Notificações</span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-police-blue">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={navigateToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
