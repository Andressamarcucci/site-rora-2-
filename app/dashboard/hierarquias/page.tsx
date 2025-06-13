"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AlertCircle, Award, ChevronUp, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/lib/types"

// Tipo para hierarquias
interface Hierarquia {
  id: string
  nome: string
  nivel: number
  descricao: string
  insignia?: string
  permissoes: string[]
  createdAt: string
  updatedAt?: string
  policial?: string
  patente?: string
}

interface Policial {
  id: string
  name: string
  email: string
  rank?: string
  patente?: string
  avatar?: string
  status?: "ativo" | "inativo" | "afastado"
}

export default function HierarquiasPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [hierarquias, setHierarquias] = useState<Hierarquia[]>([])
  const [policiais, setPoliciais] = useState<Policial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [expandedPatentes, setExpandedPatentes] = useState<{[key: string]: boolean}>({})

  // Toggle para expandir/recolher a lista de policiais de uma patente
  const toggleExpandPatente = (patenteId: string) => {
    setExpandedPatentes(prev => ({
      ...prev,
      [patenteId]: !prev[patenteId]
    }))
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

    // Carregar hierarquias do localStorage
    const storedHierarquias = localStorage.getItem("hierarquias")
    if (storedHierarquias) {
      try {
        const hierarquiasData = JSON.parse(storedHierarquias)
        setHierarquias(hierarquiasData)
      } catch (error) {
        console.error("Erro ao carregar hierarquias", error)
      }
    }

    // Carregar policiais do localStorage
    const storedPoliciais = localStorage.getItem("policiais")
    if (storedPoliciais) {
      try {
        const policiaisData = JSON.parse(storedPoliciais)
        setPoliciais(policiaisData)
      } catch (error) {
        console.error("Erro ao carregar policiais", error)
      }
    }

    setIsLoading(false)
  }, [])

  // Filtrar e ordenar hierarquias
  const filteredHierarquias = hierarquias
    .filter(h => 
      h.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a.nivel - b.nivel
      } else {
        return b.nivel - a.nivel
      }
    })

  // Função para obter os policiais de uma determinada patente
  const getPoliciaisByPatente = (patente: string) => {
    return policiais.filter(p => 
      p.patente === patente || p.rank === patente
    )
  }

  // Função para alternar a direção da ordenação
  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === "asc" ? "desc" : "asc")
  }

  // Lista de cores para os cartões baseada no nível
  const getCardColor = (nivel: number) => {
    const colors = [
      "from-yellow-500 to-amber-600", // Coronel
      "from-yellow-400 to-amber-500", // Tenente-Coronel
      "from-blue-600 to-indigo-700", // Major
      "from-blue-500 to-indigo-600", // Capitão
      "from-blue-400 to-indigo-500", // Tenente
      "from-gray-600 to-gray-800", // Sargento
      "from-gray-500 to-gray-700", // Cabo
      "from-gray-400 to-gray-600", // Soldado
    ]
    
    // Quanto menor o nível, mais alto na hierarquia
    const colorIndex = Math.min(nivel - 1, colors.length - 1)
    return colors[Math.max(0, colorIndex)]
  }
  
  const getInsigniaImagem = (nome: string) => {
    // Simplificar o nome para usar como parte do nome do arquivo
    const normalizedNome = nome.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
    return `/images/insignias/${normalizedNome}.png`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Hierarquias</h2>
        <p className="text-rota-darkgold">Visualize a estrutura hierárquica do batalhão</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por patente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-black border-rota-darkgold text-rota-lightgold"
          />
        </div>
      </div>

      {filteredHierarquias.length === 0 ? (
        <Alert variant="default" className="border-rota-darkgold bg-rota-black">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhuma hierarquia encontrada</AlertTitle>
          <AlertDescription>
            Não foram encontradas hierarquias com os termos pesquisados.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHierarquias.map((hierarquia) => {
            const patentePolicial = getPoliciaisByPatente(hierarquia.nome)
            const hasPolices = patentePolicial.length > 0
            const isExpanded = expandedPatentes[hierarquia.id] || false
            
            return (
              <Card 
                key={hierarquia.id} 
                className="border-rota-darkgold overflow-hidden hover:shadow-md hover:shadow-rota-darkgold/20 transition-shadow flex flex-col max-h-[600px]"
              >
                <div className={`h-2 bg-gradient-to-r ${getCardColor(hierarquia.nivel)}`} />
                <CardHeader className="flex-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#ffbf00]">{hierarquia.nome}</CardTitle>
                      <CardDescription className="text-rota-darkgold">
                        Nível hierárquico: {hierarquia.nivel}
                      </CardDescription>
                    </div>
                    
                    <div className="flex-shrink-0 bg-rota-black rounded-full p-2 border border-rota-darkgold">
                      <Award className="h-6 w-6 text-rota-gold" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                  <p className="text-sm text-rota-gold">{hierarquia.descricao}</p>
                  
                  {hierarquia.permissoes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium mb-2 text-rota-darkgold">Responsabilidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {hierarquia.permissoes.map((permissao) => (
                          <Badge 
                            key={permissao} 
                            variant="outline" 
                            className="text-xs border-rota-darkgold text-rota-gold"
                          >
                            {permissao.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {hierarquia.policial && (
                    <div className="pt-2 border-t border-rota-darkgold/30">
                      <p className="text-xs text-rota-darkgold">
                        Ocupado por: <span className="text-rota-gold">{hierarquia.policial}</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Seção de policiais com a patente */}
                  <div className="pt-2 border-t border-rota-darkgold/30">
                    <div 
                      className="flex justify-between items-center cursor-pointer py-1"
                      onClick={() => toggleExpandPatente(hierarquia.id)}
                    >
                      <h4 className="text-xs font-medium text-rota-darkgold">
                        Policiais nesta patente ({patentePolicial.length})
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-rota-gold hover:text-rota-darkgold hover:bg-transparent"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                        {patentePolicial.length === 0 ? (
                          <p className="text-xs text-rota-darkgold italic">
                            Nenhum policial com esta patente.
                          </p>
                        ) : (
                          patentePolicial.map(policial => (
                            <div 
                              key={policial.id} 
                              className="flex items-center gap-2 p-2 rounded bg-rota-black/50 border border-rota-darkgold/20"
                            >
                              <div className="w-6 h-6 flex-shrink-0 rounded-full bg-rota-darkgold flex items-center justify-center text-xs font-medium text-black">
                                {policial.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-rota-gold truncate">{policial.name}</p>
                                {policial.status && (
                                  <p className="text-xs text-rota-darkgold">
                                    Status: <Badge variant={policial.status === 'ativo' ? 'default' : 'outline'} className="ml-1 text-[10px] py-0 h-4">
                                      {policial.status.charAt(0).toUpperCase() + policial.status.slice(1)}
                                    </Badge>
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 