"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, AlertCircle, ImageIcon } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// Dados iniciais para demonstração
const fardamentosIniciais: Fardamento[] = [
  {
    id: "1",
    nome: "Fardamento Operacional Padrão",
    tipo: "operacional",
    descricao: "Uniforme padrão para operações diárias, composto por camisa preta e calça tática.",
    imagem: "/placeholder.svg?height=200&width=200",
    disponivel: true,
    createdAt: "2022-01-15",
    updatedAt: "2023-04-10",
  },
  {
    id: "2",
    nome: "Fardamento Tático Especial",
    tipo: "tático",
    descricao: "Uniforme reforçado para operações especiais, com proteção balística e acessórios táticos.",
    imagem: "/placeholder.svg?height=200&width=200",
    disponivel: true,
    createdAt: "2022-02-20",
  },
  {
    id: "3",
    nome: "Fardamento Cerimonial",
    tipo: "cerimonial",
    descricao: "Uniforme formal para cerimônias e eventos oficiais.",
    imagem: "/placeholder.svg?height=200&width=200",
    disponivel: true,
    createdAt: "2022-03-05",
  },
  {
    id: "4",
    nome: "Fardamento Camuflado Urbano",
    tipo: "camuflado",
    descricao: "Uniforme com padrão de camuflagem para operações em ambiente urbano.",
    imagem: "/placeholder.svg?height=200&width=200",
    disponivel: false,
    createdAt: "2022-04-12",
    updatedAt: "2023-01-20",
  },
]

// Tipos de fardamentos disponíveis
const tiposFardamento = [
  { id: "operacional", nome: "Operacional" },
  { id: "cerimonial", nome: "Cerimonial" },
  { id: "camuflado", nome: "Camuflado" },
  { id: "tático", nome: "Tático" },
  { id: "outro", nome: "Outro" },
]

export default function FardamentosPage() {
  const router = useRouter()
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [fardamentos, setFardamentos] = useState<Fardamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Estados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [disponibilidadeFilter, setDisponibilidadeFilter] = useState<string>("todos")
  const [sortField, setSortField] = useState<keyof Fardamento>("nome")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Estados para o modal de adicionar/editar fardamento
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentFardamento, setCurrentFardamento] = useState<Fardamento | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "operacional" as Fardamento["tipo"],
    descricao: "",
    imagem: "/placeholder.svg?height=200&width=200",
    disponivel: true,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    // Carregar informações do administrador atual
    const admin = localStorage.getItem("currentAdmin")
    if (admin) {
      setCurrentAdmin(JSON.parse(admin))
    } else {
      router.push("/admin/login?redirectTo=/admin/dashboard/fardamentos")
      return
    }

    // Carregar fardamentos do localStorage ou usar dados iniciais
    const storedFardamentos = localStorage.getItem("fardamentos")
    if (storedFardamentos) {
      setFardamentos(JSON.parse(storedFardamentos))
    } else {
      setFardamentos(fardamentosIniciais)
      localStorage.setItem("fardamentos", JSON.stringify(fardamentosIniciais))
    }

    setIsLoading(false)
  }, [router])

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
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

  // Função para abrir o modal de adicionar fardamento
  const handleAddFardamento = () => {
    setCurrentFardamento(null)
    setFormData({
      nome: "",
      tipo: "operacional",
      descricao: "",
      imagem: "/placeholder.svg?height=200&width=200",
      disponivel: true,
    })
    setPreviewImage(null)
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de editar fardamento
  const handleEditFardamento = (fardamento: Fardamento) => {
    setCurrentFardamento(fardamento)
    setFormData({
      nome: fardamento.nome,
      tipo: fardamento.tipo,
      descricao: fardamento.descricao,
      imagem: fardamento.imagem || "/placeholder.svg?height=200&width=200",
      disponivel: fardamento.disponivel,
    })
    setPreviewImage(fardamento.imagem || null)
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de excluir fardamento
  const handleDeleteFardamento = (fardamento: Fardamento) => {
    setCurrentFardamento(fardamento)
    setIsDeleteDialogOpen(true)
  }

  // Função para salvar um novo fardamento ou atualizar um existente
  const handleSaveFardamento = () => {
    // Validar campos obrigatórios
    if (!formData.nome || !formData.descricao) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }

    try {
      let updatedFardamentos: Fardamento[]

      if (currentFardamento) {
        // Atualizar fardamento existente
        updatedFardamentos = fardamentos.map((f) => {
          if (f.id === currentFardamento.id) {
            return {
              ...f,
              nome: formData.nome,
              tipo: formData.tipo,
              descricao: formData.descricao,
              imagem: formData.imagem,
              disponivel: formData.disponivel,
              updatedAt: new Date().toISOString(),
            }
          }
          return f
        })
        setSuccess(`Fardamento ${formData.nome} atualizado com sucesso.`)
      } else {
        // Adicionar novo fardamento
        const newFardamento: Fardamento = {
          id: Date.now().toString(),
          nome: formData.nome,
          tipo: formData.tipo,
          descricao: formData.descricao,
          imagem: formData.imagem,
          disponivel: formData.disponivel,
          createdAt: new Date().toISOString(),
        }
        updatedFardamentos = [...fardamentos, newFardamento]
        setSuccess(`Fardamento ${formData.nome} adicionado com sucesso.`)
      }

      // Atualizar estado e localStorage
      setFardamentos(updatedFardamentos)
      localStorage.setItem("fardamentos", JSON.stringify(updatedFardamentos))
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

  // Função para confirmar a exclusão de um fardamento
  const handleConfirmDelete = () => {
    if (!currentFardamento) return

    try {
      const updatedFardamentos = fardamentos.filter((f) => f.id !== currentFardamento.id)
      setFardamentos(updatedFardamentos)
      localStorage.setItem("fardamentos", JSON.stringify(updatedFardamentos))
      setIsDeleteDialogOpen(false)
      setSuccess(`Fardamento ${currentFardamento.nome} excluído com sucesso.`)

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao excluir. Tente novamente.")
    }
  }

  // Função para alternar a direção da ordenação
  const handleSort = (field: keyof Fardamento) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filtrar e ordenar fardamentos
  const filteredFardamentos = fardamentos
    .filter((f) => {
      // Filtro de busca
      const searchMatch =
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.descricao.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de tipo
      const tipoMatch = tipoFilter === "todos" || f.tipo === tipoFilter

      // Filtro de disponibilidade
      const disponibilidadeMatch =
        disponibilidadeFilter === "todos" ||
        (disponibilidadeFilter === "disponivel" && f.disponivel) ||
        (disponibilidadeFilter === "indisponivel" && !f.disponivel)

      return searchMatch && tipoMatch && disponibilidadeMatch
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
          <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Gestão de Fardamentos</h2>
          <p className="text-rota-darkgold">Gerencie os uniformes e equipamentos do batalhão.</p>
        </div>

        <Button onClick={handleAddFardamento} className="flex items-center gap-2 bg-rota-gold text-black hover:bg-amber-500">
          <Plus className="h-4 w-4" />
          <span>Adicionar Fardamento</span>
        </Button>
      </div>

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

      <Card className="bg-rota-gray border-rota-darkgold mb-8 w-full">
        <CardHeader>
          <CardTitle className="text-rota-gold">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black border-rota-darkgold text-rota-lightgold"
              />
            </div>

            <div>
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="todos">Todos os Tipos</option>
                {tiposFardamento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={disponibilidadeFilter}
                onChange={(e) => setDisponibilidadeFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="todos">Todas as Disponibilidades</option>
                <option value="disponivel">Disponível</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 w-full">
        {filteredFardamentos.length > 0 ? (
          filteredFardamentos.map((fardamento) => (
            <Card key={fardamento.id} className="bg-rota-gray border-rota-darkgold overflow-hidden">
              <div className="h-48 bg-black relative">
                {fardamento.imagem ? (
                  <img
                    src={fardamento.imagem || "/placeholder.svg"}
                    alt={fardamento.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-rota-black">
                    <ImageIcon className="h-16 w-16 text-rota-darkgold" />
                  </div>
                )}
                <Badge
                  className={`absolute top-2 right-2 ${
                    fardamento.disponivel ? "bg-green-700 hover:bg-green-800" : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  {fardamento.disponivel ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-rota-gold">{fardamento.nome}</CardTitle>
                  <Badge variant="outline" className="border-rota-darkgold text-rota-lightgold">
                    {tiposFardamento.find((t) => t.id === fardamento.tipo)?.nome || fardamento.tipo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-rota-darkgold">{fardamento.descricao}</p>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs text-rota-darkgold">
                    Adicionado em: {new Date(fardamento.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditFardamento(fardamento)}
                      className="text-rota-gold hover:text-rota-lightgold hover:bg-rota-black"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFardamento(fardamento)}
                      className="text-rota-gold hover:text-red-500 hover:bg-rota-black"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-rota-darkgold">
            Nenhum fardamento encontrado com os filtros atuais
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar fardamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentFardamento ? "Editar Fardamento" : "Adicionar Novo Fardamento"}</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              {currentFardamento
                ? "Atualize as informações do fardamento no formulário abaixo."
                : "Preencha o formulário abaixo para adicionar um novo fardamento ao batalhão."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-rota-gold">
                Nome do Fardamento*
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="bg-black border-rota-darkgold text-rota-lightgold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-rota-gold">
                  Tipo de Fardamento*
                </Label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {tiposFardamento.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-rota-gold">Disponibilidade</Label>
                <div className="flex items-center h-10 space-x-2">
                  <input
                    type="checkbox"
                    id="disponivel"
                    name="disponivel"
                    checked={formData.disponivel}
                    onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                    className="rounded border-rota-darkgold text-rota-gold focus:ring-rota-gold"
                  />
                  <Label htmlFor="disponivel" className="text-rota-lightgold cursor-pointer">
                    Disponível para uso
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-rota-gold">
                Descrição*
              </Label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem" className="text-rota-gold">
                Imagem do Fardamento
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
                    <ImageIcon className="h-12 w-12 text-rota-darkgold" />
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
            <Button onClick={handleSaveFardamento}>
              {currentFardamento ? "Salvar Alterações" : "Adicionar Fardamento"}
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
              Tem certeza que deseja excluir o fardamento {currentFardamento?.nome}? Esta ação não pode ser desfeita.
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
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
