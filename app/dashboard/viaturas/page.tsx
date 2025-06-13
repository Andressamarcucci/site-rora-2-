"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AlertCircle, Search, Car, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { User } from "@/lib/types"

// Tipo para viaturas
interface Viatura {
  id: string
  modelo: string
  placa: string
  tipo: "sedan" | "suv" | "caminhonete" | "moto" | "blindado" | "outro"
  unidade: string
  status: "operacional" | "manutencao" | "inativa"
  imagem?: string
  descricao?: string
  createdAt: string
  updatedAt?: string
}

export default function ViaturasPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viaturas, setViaturas] = useState<Viatura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [unidadeFilter, setUnidadeFilter] = useState<string>("todas")
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    operacional: 0,
    manutencao: 0,
    inativa: 0
  })

  // Função para carregar viaturas do localStorage e atualizar contadores
  const carregarViaturas = () => {
    const storedViaturas = localStorage.getItem("viaturas")
    if (storedViaturas) {
      try {
        const viaturasData = JSON.parse(storedViaturas)
        setViaturas(viaturasData)
        
        // Calcular contagens de status
        const counts = viaturasData.reduce((acc: any, viatura: Viatura) => {
          acc.total++;
          acc[viatura.status]++;
          return acc;
        }, { total: 0, operacional: 0, manutencao: 0, inativa: 0 });
        
        setStatusCounts(counts);
      } catch (error) {
        console.error("Erro ao carregar viaturas", error)
      }
    }
  }

  useEffect(() => {
    // Carregar informações do usuário atual
    const savedUser = localStorage.getItem("currentPolicial")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
      } catch (error) {
        console.error("Erro ao carregar dados do usuário", error)
      }
    }

    // Carregar viaturas inicialmente
    carregarViaturas()
    setIsLoading(false)

    // Adicionar listener para atualizar quando o localStorage mudar
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "viaturas") {
        carregarViaturas()
      }
    }

    // Registrar o listener
    window.addEventListener("storage", handleStorageChange)

    // Remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Filtrar viaturas
  const filteredViaturas = viaturas
    .filter(viatura => 
      viatura.modelo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      viatura.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viatura.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(viatura => 
      tipoFilter === "todos" || viatura.tipo === tipoFilter
    )
    .filter(viatura => 
      statusFilter === "todos" || viatura.status === statusFilter
    )
    .filter(viatura => 
      unidadeFilter === "todas" || viatura.unidade === unidadeFilter
    )

  // Tipos de viaturas disponíveis
  const tiposViatura = [
    { id: "todos", nome: "Todos os tipos" },
    { id: "sedan", nome: "Sedan" },
    { id: "suv", nome: "SUV" },
    { id: "caminhonete", nome: "Caminhonete" },
    { id: "moto", nome: "Moto" },
    { id: "blindado", nome: "Blindado" },
    { id: "outro", nome: "Outro" },
  ]

  // Status de viaturas disponíveis
  const statusViatura = [
    { id: "todos", nome: "Todos os status" },
    { id: "operacional", nome: "Operacional", cor: "green" },
    { id: "manutencao", nome: "Em Manutenção", cor: "yellow" },
    { id: "inativa", nome: "Inativa", cor: "red" },
  ]

  // Unidades disponíveis
  const unidades = [
    { id: "todas", nome: "Todas as unidades" },
    { id: "Unidade Central", nome: "Unidade Central" },
    { id: "Unidade Tática", nome: "Unidade Tática" },
    { id: "Unidade de Patrulha", nome: "Unidade de Patrulha" },
    { id: "Unidade de Apoio", nome: "Unidade de Apoio" },
  ]

  // Obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operacional":
        return "bg-green-600 hover:bg-green-700";
      case "manutencao":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "inativa":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  }

  // Formatar o status para exibição
  const formatStatus = (status: string) => {
    switch (status) {
      case "operacional":
        return "Operacional";
      case "manutencao":
        return "Em Manutenção";
      case "inativa":
        return "Inativa";
      default:
        return status;
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Viaturas</h2>
        <p className="text-rota-darkgold">Gerencie a frota de viaturas do batalhão</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar viatura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-black border-rota-darkgold text-rota-lightgold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#ffbf00]">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">{statusCounts.total}</div>
            <p className="text-xs text-rota-darkgold">Viaturas registradas</p>
          </CardContent>
        </Card>
        
        <Card className="border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#ffbf00]">Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{statusCounts.operacional}</div>
            <p className="text-xs text-rota-darkgold">Viaturas prontas para uso</p>
          </CardContent>
        </Card>
        
        <Card className="border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#ffbf00]">Em Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{statusCounts.manutencao}</div>
            <p className="text-xs text-rota-darkgold">Viaturas em reparo</p>
          </CardContent>
        </Card>
        
        <Card className="border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#ffbf00]">Inativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{statusCounts.inativa}</div>
            <p className="text-xs text-rota-darkgold">Viaturas fora de serviço</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 border-rota-darkgold">
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-rota-darkgold" />
              <Input
                type="search"
                placeholder="Pesquisar viaturas..."
                className="pl-9 bg-rota-gray border-rota-darkgold text-rota-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-rota-gold">Tipo de Viatura</p>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  {tiposViatura.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-rota-gold">Status da Viatura</p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  {statusViatura.map(status => (
                    <SelectItem key={status.id} value={status.id}>{status.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-rota-gold">Unidade</p>
              <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
                <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  <SelectValue placeholder="Filtrar por unidade" />
                </SelectTrigger>
                <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  {unidades.map(unidade => (
                    <SelectItem key={unidade.id} value={unidade.id}>{unidade.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setTipoFilter("todos")
                setStatusFilter("todos")
                setUnidadeFilter("todas")
              }}
              className="w-full border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
            >
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border-rota-darkgold">
                  <div className="flex flex-col md:flex-row gap-4 p-4">
                    <Skeleton className="h-40 w-40 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredViaturas.length === 0 ? (
            <Alert variant="default" className="border-rota-darkgold bg-rota-black">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nenhuma viatura encontrada</AlertTitle>
              <AlertDescription>
                Não foram encontradas viaturas com os filtros selecionados.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredViaturas.map(viatura => (
                <Card key={viatura.id} className="border-rota-darkgold overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-60 md:h-auto md:w-1/3 bg-rota-gray">
                      {viatura.imagem ? (
                        <Image
                          src={viatura.imagem}
                          alt={viatura.modelo}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Car className="h-12 w-12 text-rota-darkgold opacity-30" />
                        </div>
                      )}
                      
                      <Badge 
                        className={`absolute top-2 right-2 ${getStatusColor(viatura.status)}`}
                      >
                        {formatStatus(viatura.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col bg-rota-black">
                      <div>
                        <h3 className="text-lg font-bold text-[#ffbf00]">{viatura.modelo}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-rota-gold border-rota-darkgold">
                            {viatura.tipo.charAt(0).toUpperCase() + viatura.tipo.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-rota-gold border-rota-darkgold">
                            Placa: {viatura.placa}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-rota-gold mt-2 flex-grow">{viatura.descricao}</p>
                      
                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-rota-darkgold/30">
                        <div className="text-xs text-rota-darkgold">
                          <span>Unidade: <span className="text-rota-gold">{viatura.unidade}</span></span>
                        </div>
                        <div className="text-xs text-rota-darkgold">
                          {viatura.updatedAt ? (
                            <span>Atualizado em: {new Date(viatura.updatedAt).toLocaleDateString('pt-BR')}</span>
                          ) : (
                            <span>Registrado em: {new Date(viatura.createdAt).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 