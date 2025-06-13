"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Users, Award, Shirt, Car, LogOut, UserPlus, Key, Home, 
  Video, ImageIcon, AlertTriangle, FileText, BookOpen, GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { ToastProvider } from "@/components/ui/use-toast"
import { LiveNotification } from "@/components/notifications/LiveNotification"

export default function PolicialDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar informações do usuário atual
    try {
      const user = localStorage.getItem("currentUser")
      if (user) {
        const userData = JSON.parse(user)
        if (userData.role !== "policial" && userData.role !== "admin") {
          router.push("/login")
          return
        }
        setCurrentUser(userData)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser")
    } catch (error) {
      console.error("Erro ao remover dados do usuário:", error)
    }
    router.push("/")
  }

  // Se estiver carregando, mostrar um loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-4 text-rota-gold">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-black w-full h-screen">
        <aside className="w-64 border-r border-rota-darkgold min-h-screen h-full">
          <div className="flex flex-col h-full">
            <div className="border-b border-rota-darkgold">
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
                  <h1 className="text-lg font-bold text-[#ffbf00]">Painel Policial</h1>
                  <p className="text-xs text-rota-darkgold">Batalhão Tático Especial</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                <li>
                  <Link 
                    href="/policial/dashboard"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname === "/policial/dashboard" 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/profile"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/profile") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/lives"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/lives") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Lives</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/membros"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/membros") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Membros</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/fardamentos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/fardamentos") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Shirt className="h-4 w-4" />
                    <span>Fardamentos</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/viaturas"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/viaturas") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Car className="h-4 w-4" />
                    <span>Viaturas</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/galeria"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/galeria") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Galeria</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/videos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/videos") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Vídeos</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/advertencias"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/advertencias") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Advertências</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/diario-oficial"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/diario-oficial") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Diário Oficial</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/regulamentos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/regulamentos") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Regulamentos</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policial/dashboard/cursos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/policial/dashboard/cursos") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Cursos</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-6">
                <p className="px-4 text-xs font-medium text-rota-darkgold">Conta</p>
                <ul className="mt-2 space-y-1 px-2">
                  <li>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </Button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-8 w-full h-full min-h-screen">
          <div className="flex justify-end mb-6">
            <LiveNotification userId={currentUser?.id} />
          </div>
          <div className="flex-1 flex flex-col w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}