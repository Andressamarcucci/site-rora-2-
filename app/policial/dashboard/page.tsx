"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Award, Shirt, Car, Settings, UserPlus, Video, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"

export default function PolicialDashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeLives, setActiveLives] = useState(0)

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
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
    }

    // Carregar contagem de lives ativas
    const storedLives = localStorage.getItem("lives")
    if (storedLives) {
      const lives = JSON.parse(storedLives)
      const active = lives.filter((live: any) => live.status === "ativa").length
      setActiveLives(active)
    }

    setIsLoading(false)
  }, [router])

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
    <div className="w-full h-full min-h-screen space-y-6 flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">
          Bem-vindo, {currentUser?.name || "Policial"}
        </h2>
        <p className="text-rota-darkgold">
          Painel policial do Batalhão Tático Especial. Acesse suas informações e recursos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Meu Perfil</CardTitle>
            <UserPlus className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">
              Visualize e atualize suas informações pessoais e profissionais.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-rota-gold text-black hover:bg-amber-500">
              <Link href="/policial/dashboard/profile">
                <UserPlus className="mr-2 h-4 w-4" />
                Acessar Perfil
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-rota-darkgold">
                Gerencie suas transmissões ao vivo.
              </p>
              <div className="text-2xl font-bold text-[#ffbf00]">
                {activeLives}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/policial/dashboard/lives">
                <Video className="mr-2 h-4 w-4" />
                Acessar Lives
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
              Visualize os fardamentos disponíveis para seu uso.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/policial/dashboard/fardamentos">
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
            <p className="text-sm text-rota-darkgold">
              Consulte as viaturas disponíveis para uso operacional.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/policial/dashboard/viaturas">
                <Car className="mr-2 h-4 w-4" />
                Acessar Viaturas
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Galeria</CardTitle>
            <ImageIcon className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">
              Acesse fotos e imagens do batalhão.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/policial/dashboard/galeria">
                <ImageIcon className="mr-2 h-4 w-4" />
                Acessar Galeria
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-rota-gray border-rota-darkgold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Vídeos</CardTitle>
            <Video className="h-4 w-4 text-rota-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rota-darkgold">
              Assista vídeos e treinamentos do batalhão.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-rota-gold text-rota-gold hover:bg-rota-gray/50">
              <Link href="/policial/dashboard/videos">
                <Video className="mr-2 h-4 w-4" />
                Acessar Vídeos
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 