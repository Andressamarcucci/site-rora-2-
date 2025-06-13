"use client"

import { useEffect, useState } from "react"
import { Users, Award, Shirt, Car, TrendingUp, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Formatar a data atual
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentTime)

  // Formatar a hora atual
  const formattedTime = currentTime.toLocaleTimeString("pt-BR")

  // Dados simulados para o dashboard
  const stats = [
    {
      title: "Total de Membros",
      value: "42",
      icon: Users,
      description: "3 novos esta semana",
      color: "text-blue-500",
    },
    {
      title: "Hierarquias",
      value: "8",
      icon: Award,
      description: "Última atualização: 3 dias atrás",
      color: "text-yellow-500",
    },
    {
      title: "Fardamentos",
      value: "12",
      icon: Shirt,
      description: "2 novos este mês",
      color: "text-green-500",
    },
    {
      title: "Viaturas",
      value: "15",
      icon: Car,
      description: "1 em manutenção",
      color: "text-red-500",
    },
  ]

  // Atividades recentes simuladas
  const recentActivities = [
    {
      action: "Novo membro adicionado",
      user: "Carlos Silva",
      time: "10 minutos atrás",
    },
    {
      action: "Viatura atualizada",
      user: "Ana Oliveira",
      time: "2 horas atrás",
    },
    {
      action: "Fardamento cadastrado",
      user: "Roberto Santos",
      time: "5 horas atrás",
    },
    {
      action: "Hierarquia modificada",
      user: "Juliana Costa",
      time: "1 dia atrás",
    },
    {
      action: "Membro promovido",
      user: "Pedro Almeida",
      time: "2 dias atrás",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bem-vindo ao Sistema</h2>
          <p className="text-muted-foreground">Painel de controle do Batalhão Tático Especial</p>
        </div>

        <div className="bg-police-darkblue p-3 rounded-lg flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono">{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b border-police-lightgray pb-4 last:border-0 last:pb-0"
                >
                  <div className="rounded-full p-2 bg-police-blue/10">
                    <TrendingUp className="h-4 w-4 text-police-blue" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Informações do Batalhão</CardTitle>
            <CardDescription>Dados gerais sobre a corporação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Comandante</p>
                  <p className="text-sm">Cel. Ricardo Alves</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Sub-Comandante</p>
                  <p className="text-sm">Ten. Cel. Marcos Souza</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Fundação</p>
                  <p className="text-sm">15/03/2022</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Sede</p>
                  <p className="text-sm">Quartel Central</p>
                </div>
              </div>

              <div className="pt-4 border-t border-police-lightgray">
                <h4 className="text-sm font-medium mb-2">Próximos Eventos</h4>
                <ul className="space-y-2">
                  <li className="text-sm flex justify-between">
                    <span>Treinamento Tático</span>
                    <span className="text-muted-foreground">Amanhã, 19:00</span>
                  </li>
                  <li className="text-sm flex justify-between">
                    <span>Reunião de Comando</span>
                    <span className="text-muted-foreground">Quinta, 20:00</span>
                  </li>
                  <li className="text-sm flex justify-between">
                    <span>Operação Especial</span>
                    <span className="text-muted-foreground">Sábado, 21:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="border-rota-darkgold bg-rota-gray">
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Regulamentos</CardTitle>
            <CardDescription>Consulte todos os regulamentos e manuais oficiais.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-rota-lightgold">Acesse normas, manuais e códigos de conduta da corporação.</p>
            <Button asChild className="w-full bg-rota-gold text-black hover:bg-amber-500">
              <a href="/dashboard/regulamentos">Ver Regulamentos</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-rota-darkgold bg-rota-gray">
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Diário Oficial</CardTitle>
            <CardDescription>Veja comunicados, editais e publicações oficiais.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-rota-lightgold">Fique por dentro das novidades e comunicados do batalhão.</p>
            <Button asChild className="w-full bg-rota-gold text-black hover:bg-amber-500">
              <a href="/dashboard/diario-oficial">Ver Diário Oficial</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-rota-darkgold bg-rota-gray">
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Vídeos</CardTitle>
            <CardDescription>Assista vídeos táticos, treinamentos e operações.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-rota-lightgold">Conteúdo audiovisual para aprimorar seu conhecimento.</p>
            <Button asChild className="w-full bg-rota-gold text-black hover:bg-amber-500">
              <a href="/dashboard/videos">Ver Vídeos</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
