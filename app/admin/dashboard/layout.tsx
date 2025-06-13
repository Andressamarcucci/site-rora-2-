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

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar informações do administrador atual
    try {
      const admin = localStorage.getItem("currentAdmin")
      if (admin) {
        const adminData = JSON.parse(admin)
        setCurrentAdmin(adminData)
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error)
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentAdmin")
    } catch (error) {
      console.error("Erro ao remover dados do admin:", error)
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
      <div className="flex min-h-screen bg-black">
        <aside className="w-64 border-r border-rota-darkgold min-h-screen">
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
                  <h1 className="text-lg font-bold text-[#ffbf00]">Painel Admin</h1>
                  <p className="text-xs text-rota-darkgold">Batalhão Tático Especial</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                <li>
                  <Link 
                    href="/admin/dashboard"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname === "/admin/dashboard" 
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
                    href="/admin/dashboard/policiais"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/policiais") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Policiais</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/dashboard/hierarquias"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/hierarquias") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    <span>Hierarquias</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/dashboard/fardamentos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/fardamentos") 
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
                    href="/admin/dashboard/viaturas"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/viaturas") 
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
                    href="/admin/dashboard/galeria"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/galeria") 
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
                    href="/admin/dashboard/videos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/videos") 
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
                    href="/admin/dashboard/advertencias"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/advertencias") 
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
                    href="/admin/dashboard/diario-oficial"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/diario-oficial") 
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
                    href="/admin/dashboard/regulamentos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/regulamentos") 
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
                    href="/admin/dashboard/cursos"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/cursos") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Cursos</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/dashboard/lives"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      pathname.includes("/admin/dashboard/lives") 
                        ? "bg-rota-gray text-[#ffbf00]" 
                        : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Lives</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-6">
                <p className="px-4 text-xs font-medium text-rota-darkgold">Administração</p>
                <ul className="mt-2 space-y-1 px-2">
                  <li>
                    <Link 
                      href="/admin/dashboard/usuarios"
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                        pathname.includes("/admin/dashboard/usuarios") 
                          ? "bg-rota-gray text-[#ffbf00]" 
                          : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Usuários</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/admin/dashboard/permissoes"
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                        pathname.includes("/admin/dashboard/permissoes") 
                          ? "bg-rota-gray text-[#ffbf00]" 
                          : "text-rota-darkgold hover:bg-rota-gray/50 hover:text-[#ffbf00]"
                      }`}
                    >
                      <Key className="h-4 w-4" />
                      <span>Permissões</span>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4 px-2">
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="flex items-center justify-center w-full border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Deslogar</span>
                </Button>
              </div>
            </nav>
          </div>
        </aside>

        <div className="flex-1 w-full h-[calc(100vh-2rem)] overflow-hidden">
          <header className="h-16 border-b border-rota-darkgold">
            <div className="flex h-full items-center justify-between px-6">
              <h1 className="text-lg font-bold text-[#ffbf00]">
                Batalhão Tático Especial - Área Administrativa
              </h1>
            </div>
          </header>
          
          <div className="p-6 h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}
