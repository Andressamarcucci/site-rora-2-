"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { User } from "@/lib/types"

export function AuthCheck({
  children,
  adminOnly = false,
  redirectTo = "/admin/login",
}: {
  children: React.ReactNode
  adminOnly?: boolean
  redirectTo?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado como administrador
    const admin = localStorage.getItem("currentAdmin")

    // Se estamos na página de login de admin, não redirecionar
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    if (!admin) {
      // Redirecionar para a página de login com mensagem
      const redirectURL = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}&message=${encodeURIComponent('Sua sessão expirou. Por favor, faça login novamente.')}`
      router.push(redirectURL)
    } else {
      try {
        const adminData = JSON.parse(admin) as User
        setCurrentAdmin(adminData)

        // Verificar se o usuário tem permissão de administrador quando adminOnly=true
        if (adminOnly && adminData.role !== "admin") {
          const redirectURL = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}&message=${encodeURIComponent('Você não tem permissão para acessar esta página.')}`
          router.push(redirectURL)
          return
        }

        // Verificar se a sessão expirou (após 24 horas)
        const now = new Date()
        const lastLogin = adminData.lastLogin ? new Date(adminData.lastLogin) : null

        if (lastLogin && (now.getTime() - lastLogin.getTime() > 86400000)) { // 24 horas = 86400000 ms
          // Sessão expirada após 24 horas
          localStorage.removeItem("currentAdmin")
          const redirectURL = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}&message=${encodeURIComponent('Sua sessão expirou. Por favor, faça login novamente.')}`
          router.push(redirectURL)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Erro ao analisar dados do admin:", error)
        localStorage.removeItem("currentAdmin")
        const redirectURL = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}&message=${encodeURIComponent('Ocorreu um erro. Por favor, faça login novamente.')}`
        router.push(redirectURL)
      }
    }

    setIsLoading(false)
  }, [router, pathname, adminOnly, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-police-blue mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se estamos na página de login, renderizar normalmente
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Se não estiver autenticado, não renderizar nada (o redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
