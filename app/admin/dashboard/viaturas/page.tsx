"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, AlertCircle, ChevronUp, ChevronDown, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// Dados iniciais para demonstração
const viaturasIniciais: Viatura[] = [
  {
    id: "1",
    modelo: "SUV Tático X1",
    placa: "ROT-1234",
    tipo: "suv",
    unidade: "Unidade Central",
    status: "operacional",
    imagem: "/placeholder.svg?height=200&width=300",
    descricao: "Viatura principal para operações táticas, equipada com blindagem nível III.",
    createdAt: "2022-01-10",
    updatedAt: "2023-05-15",
  },
  {
    id: "2",
    modelo: "Sedan Patrulha S2",
    placa: "ROT-2345",
    tipo: "sedan",
    unidade: "Unidade de Patrulha",
    status: "operacional",
    imagem: "/placeholder.svg?height=200&width=300",
    descricao: "Viatura para patrulhamento urbano regular.",
    createdAt: "2022-02-15",
  },
  {
    id: "3",
    modelo: "Caminhonete Tática C1",
    placa: "ROT-3456",
    tipo: "caminhonete",
    unidade: "Unidade Tática",
    status: "manutencao",
    imagem: "/placeholder.svg?height=200&width=300",
    descricao: "Viatura para operações em terrenos acidentados e transporte de equipamentos.",
    createdAt: "2022-03-20",
    updatedAt: "2023-06-10",
  },
  {
    id: "4",
    modelo: "Moto Rápida M1",
    placa: "ROT-4567",
    tipo: "moto",
    unidade: "Unidade de Patrulha",
    status: "operacional",
    imagem: "/placeholder.svg?height=200&width=300",
    descricao: "Motocicleta para resposta rápida e patrulhamento em áreas de difícil acesso.",
    createdAt: "2022-04-25",
  },
  {
    id: "5",
    modelo: "Blindado Especial B1",
    placa: "ROT-5678",
    tipo: "blindado",
    unidade: "Unidade Tática",
    status: "inativa",
    imagem: "/placeholder.svg?height=200&width=300",
    descricao: "Veículo blindado para operações especiais de alto risco.",
    createdAt: "2022-05-30",
    updatedAt: "2023-04-05",
  },
]

// Tipos de viaturas disponíveis
const tiposViatura = [
  { id: "sedan", nome: "Sedan" },
  { id: "suv", nome: "SUV" },
  { id: "caminhonete", nome: "Caminhonete" },
  { id: "moto", nome: "Moto" },
  { id: "blindado", nome: "Blindado" },
  { id: "outro", nome: "Outro" },
]

// Status de viaturas disponíveis
const statusViatura = [
  { id: "operacional", nome: "Operacional", cor: "green" },
  { id: "manutencao", nome: "Em Manutenção", cor: "yellow" },
  { id: "inativa", nome: "Inativa", cor: "red" },
]

// Unidades disponíveis
const unidades = ["Unidade Central", "Unidade Tática", "Unidade de Patrulha", "Unidade de Apoio"]

export default function ViaturasPage() {
  const router = useRouter()
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [viaturas, setViaturas] = useState<Viatura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Estados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [unidadeFilter, setUnidadeFilter] = useState<string>("todas")
  const [sortField, setSortField] = useState<keyof Viatura>("modelo")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Estados para o modal de adicionar/editar viatura
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentViatura, setCurrentViatura] = useState<Viatura | null>(null)
  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    tipo: "sedan" as Viatura["tipo"],
    unidade: "",
    status: "operacional" as Viatura["status"],
    imagem: "/placeholder.svg?height=200&width=300",
    descricao: "",
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    // Carregar informações do administrador atual
    const admin = localStorage.getItem("currentAdmin")
    if (admin) {
      setCurrentAdmin(JSON.parse(admin))
    } else {
      router.push("/admin/login?redirectTo=/admin/dashboard/viaturas")
      return
    }

    // Carregar viaturas do localStorage ou usar dados iniciais
    const storedViaturas = localStorage.getItem("viaturas")
    if (storedViaturas) {
      setViaturas(JSON.parse(storedViaturas))
    } else {
      setViaturas(viaturasIniciais)
      localStorage.setItem("viaturas", JSON.stringify(viaturasIniciais))
    }

    setIsLoading(false)
  }, [router])

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Função para lidar com o upload de imagem (simulado)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Em um caso real, aqui faríamos o upload da imagem para um servidor
      // Para esta demonstração, vamos apenas simular com uma URL local
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setFormData({
        ...formData,
        imagem: imageUrl,
      })
    }
  }

  // Função para abrir o modal de adicionar viatura
  const handleAddViatura = () => {
    setCurrentViatura(null)
    setFormData({
      modelo: "",
      placa: "",
      tipo: "sedan",
      unidade: unidades[0],
      status: "operacional",
      imagem: "/placeholder.svg?height=200&width=300",
      descricao: "",
    })
    setPreviewImage(null)
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de editar viatura
  const handleEditViatura = (viatura: Viatura) => {
    setCurrentViatura(viatura)
    setFormData({
      modelo: viatura.modelo,
      placa: viatura.placa,
      tipo: viatura.tipo,
      unidade: viatura.unidade,
      status: viatura.status,
      imagem: viatura.imagem || "/placeholder.svg?height=200&width=300",
      descricao: viatura.descricao || "",
    })
    setPreviewImage(viatura.imagem || null)
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de excluir viatura
  const handleDeleteViatura = (viatura: Viatura) => {
    setCurrentViatura(viatura)
    setIsDeleteDialogOpen(true)
  }

  // Função para salvar uma nova viatura ou atualizar uma existente
  const handleSaveViatura = () => {
    // Validar campos obrigatórios
    if (!formData.modelo || !formData.placa || !formData.unidade) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }

    // Validar formato da placa (simplificado para demonstração)
    const placaRegex = /^[A-Z]{3}-\d{4}$/
    if (!placaRegex.test(formData.placa)) {
      setError("Formato de placa inválido. Use o formato XXX-0000.")
      return
    }

    try {
      let updatedViaturas: Viatura[]

      if (currentViatura) {
        // Atualizar viatura existente
        updatedViaturas = viaturas.map((v) => {
          if (v.id === currentViatura.id) {
            return {
              ...v,
              modelo: formData.modelo,
              placa: formData.placa,
              tipo: formData.tipo,
              unidade: formData.unidade,
              status: formData.status,
              imagem: formData.imagem,
              descricao: formData.descricao,
              updatedAt: new Date().toISOString(),
            }
          }
          return v
        })
        setSuccess(`Viatura ${formData.modelo} (${formData.placa}) atualizada com sucesso.`)
      } else {
        // Verificar se já existe uma viatura com a mesma placa
        if (viaturas.some((v) => v.placa === formData.placa)) {
          setError("Já existe uma viatura com esta placa.")
          return
        }

        // Adicionar nova viatura
        const newViatura: Viatura = {
          id: Date.now().toString(),
          modelo: formData.modelo,
          placa: formData.placa,
          tipo: formData.tipo,
          unidade: formData.unidade,
          status: formData.status,
          imagem: formData.imagem,
          descricao: formData.descricao,
          createdAt: new Date().toISOString(),
        }
        updatedViaturas = [...viaturas, newViatura]
        setSuccess(`Viatura ${formData.modelo} (${formData.placa}) adicionada com sucesso.`)
      }

      // Atualizar estado e localStorage
      setViaturas(updatedViaturas)
      localStorage.setItem("viaturas", JSON.stringify(updatedViaturas))
      setIsDialogOpen(false)
      setError("")

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao salvar. Tente novamente.")
    }
  }

  // Função para confirmar a exclusão de uma viatura
  const handleConfirmDelete = () => {
    if (!currentViatura) return

    try {
      const updatedViaturas = viaturas.filter((v) => v.id !== currentViatura.id)
      setViaturas(updatedViaturas)
      localStorage.setItem("viaturas", JSON.stringify(updatedViaturas))
      setIsDeleteDialogOpen(false)
      setSuccess(`Viatura ${currentViatura.modelo} (${currentViatura.placa}) excluída com sucesso.`)

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao excluir. Tente novamente.")
    }
  }

  // Função para alternar a direção da ordenação
  const handleSort = (field: keyof Viatura) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filtrar e ordenar viaturas
  const filteredViaturas = viaturas
    .filter((v) => {
      // Filtro de busca
      const searchMatch =
        v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.descricao && v.descricao.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filtro de tipo
      const tipoMatch = tipoFilter === "todos" || v.tipo === tipoFilter

      // Filtro de status
      const statusMatch = statusFilter === "todos" || v.status === statusFilter

      // Filtro de unidade
      const unidadeMatch = unidadeFilter === "todas" || v.unidade === unidadeFilter

      return searchMatch && tipoMatch && statusMatch && unidadeMatch
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-4 text-rota-darkgold">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 min-h-[calc(100vh-16rem)] w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Gestão de Viaturas</h2>
          <p className="text-rota-darkgold">Gerenciamento da frota operacional do batalhão.</p>
        </div>

        <Button onClick={handleAddViatura} className="flex items-center gap-2 bg-rota-gold text-black hover:bg-amber-500">
          <Plus className="h-4 w-4" />
          <span>Nova Viatura</span>
        </Button>
      </div>

      {(error || success) && (
        <div className="mb-6">
          {error && (
            <Alert variant="destructive" className="bg-red-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-800 border-green-600">
              <AlertDescription className="text-white">{success}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <Card className="bg-rota-gray border-rota-darkgold">
        <CardHeader>
          <CardTitle className="text-[#ffbf00]">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Modelo, placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black border-rota-darkgold text-rota-lightgold"
              />
            </div>

            <div>
              <Label htmlFor="tipoFilter">Tipo</Label>
              <select
                id="tipoFilter"
                className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold"
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                {tiposViatura.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <select
                id="statusFilter"
                className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                {statusViatura.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="text-rota-gold border-rota-darkgold"
              onClick={() => {
                setSearchTerm("")
                setTipoFilter("todos")
                setStatusFilter("todos")
                setUnidadeFilter("todas")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
        <Card className="bg-gradient-to-br from-slate-900/40 to-slate-700/20 bg-rota-gray border-rota-darkgold h-[160px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">{viaturas.length}</div>
            <p className="text-xs text-rota-darkgold">Veículos cadastrados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/30 to-green-700/10 bg-rota-gray border-rota-darkgold h-[160px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">
              {viaturas.filter(v => v.status === "operacional").length}
            </div>
            <p className="text-xs text-rota-darkgold">Prontas para uso</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-700/10 bg-rota-gray border-rota-darkgold h-[160px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Em Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">
              {viaturas.filter(v => v.status === "manutencao").length}
            </div>
            <p className="text-xs text-rota-darkgold">Em revisão ou reparo</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-900/30 to-red-700/10 bg-rota-gray border-rota-darkgold h-[160px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Inativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">
              {viaturas.filter(v => v.status === "inativa").length}
            </div>
            <p className="text-xs text-rota-darkgold">Fora de serviço</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 w-full">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-rota-gold">Carregando...</div>
        ) : filteredViaturas.length === 0 ? (
          <div className="col-span-full text-center py-12 text-rota-gold">Nenhuma viatura encontrada.</div>
        ) : (
          filteredViaturas.map((viatura) => (
            <Card key={viatura.id} className="overflow-hidden bg-rota-gray border-rota-darkgold hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-black">
                <img 
                  src={viatura.imagem} 
                  alt={viatura.modelo}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className={`
                    absolute top-2 right-2
                    ${viatura.status === "operacional" ? "bg-green-600" : ""}
                    ${viatura.status === "manutencao" ? "bg-yellow-600" : ""}
                    ${viatura.status === "inativa" ? "bg-red-600" : ""}
                  `}
                >
                  {statusViatura.find(s => s.id === viatura.status)?.nome}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg tracking-tight text-rota-gold">{viatura.modelo}</h3>
                    <p className="text-sm text-rota-gold">{viatura.placa}</p>
                  </div>
                  <Badge variant="outline" className="bg-rota-gold/20 text-rota-gold border-rota-gold/40">
                    {tiposViatura.find(t => t.id === viatura.tipo)?.nome}
                  </Badge>
                </div>
                
                <div className="text-sm text-rota-gold mb-4">{viatura.unidade}</div>
                
                {viatura.descricao && (
                  <p className="text-sm line-clamp-2 mb-4 text-rota-gold">{viatura.descricao}</p>
                )}
                
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditViatura(viatura)}
                    className="text-rota-gold hover:text-rota-lightgold hover:bg-rota-black"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteViatura(viatura)}
                    className="text-rota-gold hover:text-red-500 hover:bg-rota-black"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal para adicionar/editar viatura */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentViatura ? "Editar Viatura" : "Adicionar Nova Viatura"}</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              {currentViatura
                ? "Atualize as informações da viatura no formulário abaixo."
                : "Preencha o formulário abaixo para adicionar uma nova viatura ao batalhão."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-rota-gold">
                  Modelo*
                </Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  className="bg-black border-rota-darkgold text-rota-lightgold"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placa" className="text-rota-gold">
                  Placa*
                </Label>
                <Input
                  id="placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  placeholder="XXX-0000"
                  className="bg-black border-rota-darkgold text-rota-lightgold"
                  required
                />
                <p className="text-xs text-rota-darkgold">Formato: XXX-0000</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-rota-gold">
                  Tipo de Viatura*
                </Label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {tiposViatura.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade" className="text-rota-gold">
                  Unidade*
                </Label>
                <select
                  id="unidade"
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Selecione uma unidade</option>
                  {unidades.map((unidade) => (
                    <option key={unidade} value={unidade}>
                      {unidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-rota-gold">
                Status*
              </Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {statusViatura.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-rota-gold">
                Descrição
              </Label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem" className="text-rota-gold">
                Imagem da Viatura
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="imagem"
                    name="imagem"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-black border-rota-darkgold text-rota-lightgold"
                  />
                  <p className="text-xs text-rota-darkgold mt-1">
                    Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
                  </p>
                </div>
                <div className="h-32 bg-black flex items-center justify-center rounded-md overflow-hidden">
                  {previewImage || formData.imagem ? (
                    <img src={previewImage || formData.imagem} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Car className="h-12 w-12 text-rota-darkgold" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-rota-darkgold text-rota-gold hover:bg-rota-black"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveViatura}
              className="bg-rota-gold text-black hover:bg-amber-500"
            >
              {currentViatura ? "Salvar Alterações" : "Adicionar Viatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              Tem certeza que deseja excluir a viatura {currentViatura?.modelo} ({currentViatura?.placa})? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-rota-darkgold text-rota-gold hover:bg-rota-black"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
