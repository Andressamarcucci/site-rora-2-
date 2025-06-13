"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AlertCircle, Search, Filter } from "lucide-react"
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
import type { User } from "@/lib/types"

// Tipo para fardamentos
interface Fardamento {
  id: string
  nome: string
  tipo: "operacional" | "cerimonial" | "camuflado" | "tático" | "outro"
  descricao: string
  imagem?: string
  disponivel: boolean
  createdAt: string
  updatedAt?: string
}

export default function FardamentosPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [fardamentos, setFardamentos] = useState<Fardamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [disponibilidadeFilter, setDisponibilidadeFilter] = useState<string>("todos")

  // Função para carregar fardamentos do localStorage
  const carregarFardamentos = () => {
    const storedFardamentos = localStorage.getItem("fardamentos")
    if (storedFardamentos) {
      try {
        const fardamentosData = JSON.parse(storedFardamentos)
        setFardamentos(fardamentosData)
      } catch (error) {
        console.error("Erro ao carregar fardamentos", error)
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

    // Carregar fardamentos inicialmente
    carregarFardamentos()
    setIsLoading(false)

    // Adicionar listener para atualizar quando o localStorage mudar
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fardamentos") {
        carregarFardamentos()
      }
    }

    // Registrar o listener
    window.addEventListener("storage", handleStorageChange)

    // Remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Filtrar fardamentos
  const filteredFardamentos = fardamentos
    .filter(fardamento => 
      fardamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      fardamento.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(fardamento => 
      tipoFilter === "todos" || fardamento.tipo === tipoFilter
    )
    .filter(fardamento => 
      disponibilidadeFilter === "todos" || 
      (disponibilidadeFilter === "disponivel" && fardamento.disponivel) ||
      (disponibilidadeFilter === "indisponivel" && !fardamento.disponivel)
    )

  // Tipos de fardamentos disponíveis
  const tiposFardamento = [
    { id: "todos", nome: "Todos os tipos" },
    { id: "operacional", nome: "Operacional" },
    { id: "cerimonial", nome: "Cerimonial" },
    { id: "camuflado", nome: "Camuflado" },
    { id: "tático", nome: "Tático" },
    { id: "outro", nome: "Outro" },
  ]

  // Opções de disponibilidade
  const opcoesDisponibilidade = [
    { id: "todos", nome: "Todos" },
    { id: "disponivel", nome: "Disponíveis" },
    { id: "indisponivel", nome: "Indisponíveis" },
  ]

  // Função para formatar o tipo de fardamento
  const formatarTipo = (tipo: string) => {
    const tipoObj = tiposFardamento.find(t => t.id === tipo)
    return tipoObj ? tipoObj.nome : tipo
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Fardamentos</h2>
        <p className="text-rota-darkgold">Gerencie os fardamentos do batalhão</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar fardamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-black border-rota-darkgold text-rota-lightgold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 border-rota-darkgold">
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Filtrar Fardamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-rota-darkgold" />
              <Input
                type="search"
                placeholder="Pesquisar fardamentos..."
                className="pl-9 bg-rota-gray border-rota-darkgold text-rota-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-rota-gold">Tipo de Fardamento</p>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  {tiposFardamento.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-rota-gold">Disponibilidade</p>
              <Select value={disponibilidadeFilter} onValueChange={setDisponibilidadeFilter}>
                <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  <SelectValue placeholder="Filtrar por disponibilidade" />
                </SelectTrigger>
                <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  {opcoesDisponibilidade.map(opcao => (
                    <SelectItem key={opcao.id} value={opcao.id}>{opcao.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setTipoFilter("todos")
                setDisponibilidadeFilter("todos")
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
          ) : filteredFardamentos.length === 0 ? (
            <Alert variant="default" className="border-rota-darkgold bg-rota-black">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nenhum fardamento encontrado</AlertTitle>
              <AlertDescription>
                Não foram encontrados fardamentos com os filtros selecionados.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredFardamentos.map(fardamento => (
                <Card key={fardamento.id} className="border-rota-darkgold overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-60 md:h-auto md:w-1/3 bg-rota-gray">
                      {fardamento.imagem ? (
                        <Image
                          src={fardamento.imagem}
                          alt={fardamento.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-rota-darkgold">Sem imagem</span>
                        </div>
                      )}
                      
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          fardamento.disponivel 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {fardamento.disponivel ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col bg-rota-black">
                      <div>
                        <h3 className="text-lg font-bold text-[#ffbf00]">{fardamento.nome}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-rota-gold border-rota-darkgold">
                            {formatarTipo(fardamento.tipo)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-rota-gold mt-2 flex-grow">{fardamento.descricao}</p>
                      
                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-rota-darkgold/30">
                        <div className="text-xs text-rota-darkgold">
                          {fardamento.updatedAt ? (
                            <span>Atualizado em: {new Date(fardamento.updatedAt).toLocaleDateString('pt-BR')}</span>
                          ) : (
                            <span>Criado em: {new Date(fardamento.createdAt).toLocaleDateString('pt-BR')}</span>
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