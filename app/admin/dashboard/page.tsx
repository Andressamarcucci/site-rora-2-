"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Award, Shirt, Car, Settings, UserPlus, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar informações do administrador atual
    try {
      const admin = localStorage.getItem("currentAdmin")
      if (admin) {
        setCurrentAdmin(JSON.parse(admin))
      }
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-center">
          <div className="h-6 w-6 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-2 text-xs text-rota-darkgold">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">
          Bem-vindo, {currentAdmin?.name || "Administrador"}
        </h2>
        <p className="text-rota-darkgold">
          Painel administrativo do Batalhão Tático Especial. Gerencie policiais, hierarquias, fardamentos e viaturas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Gerenciar Policiais</CardTitle>
            <Users className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">
              Cadastre e gerencie os membros do batalhão, suas patentes e funções.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-rota-gold text-black hover:bg-amber-500">
              <Link href="/admin/dashboard/policiais">
                <Users className="mr-2 h-4 w-4" />
                Acessar Policiais
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Hierarquias</CardTitle>
            <Award className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">Defina e organize as hierarquias e patentes do batalhão.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/admin/dashboard/hierarquias">
                <Award className="mr-2 h-4 w-4" />
                Acessar Hierarquias
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Fardamentos</CardTitle>
            <Shirt className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">
              Cadastre e visualize os fardamentos utilizados pelo batalhão.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/admin/dashboard/fardamentos">
                <Shirt className="mr-2 h-4 w-4" />
                Acessar Fardamentos
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Viaturas</CardTitle>
            <Car className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">Gerencie as viaturas e veículos utilizados pelo batalhão.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/admin/dashboard/viaturas">
                <Car className="mr-2 h-4 w-4" />
                Acessar Viaturas
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Usuários Administrativos</CardTitle>
            <UserPlus className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">Gerencie os usuários com acesso ao painel administrativo.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/admin/dashboard/usuarios">
                <UserPlus className="mr-2 h-4 w-4" />
                Acessar Usuários
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Lives</CardTitle>
            <Video className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">
              Gerencie as transmissões ao vivo dos policiais do batalhão.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/admin/dashboard/lives">
                <Video className="mr-2 h-4 w-4" />
                Acessar Lives
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Configurações</CardTitle>
            <Settings className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">Configure as opções do sistema e permissões de acesso.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/admin/dashboard/configuracoes">
                <Settings className="mr-2 h-4 w-4" />
                Acessar Configurações
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
