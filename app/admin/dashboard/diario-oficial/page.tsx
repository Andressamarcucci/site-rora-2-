"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Search, SortAsc, SortDesc, PlusCircle, Edit, 
  Eye, Trash2, AlertTriangle, Check, X 
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/lib/types"

interface DiarioOficial {
  id: string
  titulo: string
  conteudo: string
  data: string
  publicadoPor: string
  categoria: string
}

export default function DiarioOficialPage() {
  // Estado do administrador atual
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [diarioItens, setDiarioItens] = useState<DiarioOficial[]>([
    {
      id: "1",
      titulo: "Processo Seletivo para Sargentos",
      conteudo: "Está aberto o processo seletivo para promoção de cabos a sargentos. Os interessados devem se inscrever até o dia 15/07/2023.",
      data: "2023-07-01",
      publicadoPor: "Cap. Silva",
      categoria: "Seleção"
    },
    {
      id: "2",
      titulo: "Alteração no Regimento Interno",
      conteudo: "A partir de 01/08/2023, entrará em vigor o novo regimento interno da corporação.",
      data: "2023-07-10",
      publicadoPor: "Maj. Oliveira",
      categoria: "Regimento"
    },
    {
      id: "3",
      titulo: "Férias Coletivas - Dezembro 2023",
      conteudo: "Informamos que haverá férias coletivas no período de 20/12/2023 a 05/01/2024.",
      data: "2023-07-15",
      publicadoPor: "Ten. Cel. Rodrigues",
      categoria: "Administrativo"
    }
  ])

  // Estados para gerenciar carregamento e mensagens
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Estados para filtragem e ordenação
  const [filteredDiario, setFilteredDiario] = useState<DiarioOficial[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DiarioOficial
    direction: "asc" | "desc"
  }>({ key: "data", direction: "desc" })

  // Estados para manipulação do modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentDiario, setCurrentDiario] = useState<DiarioOficial | null>(null)
  
  // Novos estados para formulário
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    conteudo: "",
    data: "",
    categoria: "",
  })

  const { toast } = useToast()

  // Carregar dados do admin logado
  useEffect(() => {
    try {
      const admin = localStorage.getItem("currentAdmin")
      if (admin) {
        setCurrentAdmin(JSON.parse(admin))
      }
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error)
    }
  }, [])

  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...diarioItens]

    if (searchTerm) {
      result = result.filter(
        item => 
          item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.publicadoPor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoriaFiltro) {
      result = result.filter(item => item.categoria === categoriaFiltro)
    }

    // Aplicar ordenação
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

    setFilteredDiario(result)
  }, [diarioItens, searchTerm, categoriaFiltro, sortConfig])

  // Funções para manipulação de dados
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSort = (key: keyof DiarioOficial) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const handleAdd = () => {
    setFormData({
      id: "",
      titulo: "",
      conteudo: "",
      data: format(new Date(), "yyyy-MM-dd"),
      categoria: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (item: DiarioOficial) => {
    setFormData({
      id: item.id,
      titulo: item.titulo,
      conteudo: item.conteudo,
      data: item.data,
      categoria: item.categoria,
    })
    setCurrentDiario(item)
    setIsEditModalOpen(true)
  }

  const handleView = (item: DiarioOficial) => {
    setCurrentDiario(item)
    setIsViewModalOpen(true)
  }

  const handleDelete = (item: DiarioOficial) => {
    setCurrentDiario(item)
    setIsDeleteModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.titulo || !formData.conteudo || !formData.data || !formData.categoria) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
      })
      return
    }

    try {
      setIsLoading(true)
      
      if (isAddModalOpen) {
        // Simular adição de novo item
        const newItem: DiarioOficial = {
          id: Math.random().toString(36).substring(2, 9),
          ...formData,
          publicadoPor: currentAdmin?.nome || "Admin",
        }
        
        setDiarioItens(prev => [...prev, newItem])
        toast({
          title: "Sucesso",
          description: "Publicação adicionada com sucesso!",
        })
        setIsAddModalOpen(false)
      }
      
      if (isEditModalOpen && currentDiario) {
        // Simular edição de item existente
        setDiarioItens(prev =>
          prev.map(item =>
            item.id === currentDiario.id
              ? {
                  ...item,
                  titulo: formData.titulo,
                  conteudo: formData.conteudo,
                  data: formData.data,
                  categoria: formData.categoria,
                }
              : item
          )
        )
        toast({
          title: "Sucesso",
          description: "Publicação atualizada com sucesso!",
        })
        setIsEditModalOpen(false)
      }
    } catch (error) {
      console.error("Erro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar a publicação.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = () => {
    if (!currentDiario) return
    
    try {
      setIsLoading(true)
      
      // Simular exclusão
      setDiarioItens(prev => prev.filter(item => item.id !== currentDiario.id))
      
      toast({
        title: "Sucesso",
        description: "Publicação excluída com sucesso!",
      })
    } catch (error) {
      console.error("Erro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao excluir a publicação.",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  // Obter categorias únicas para o filtro
  const categorias = Array.from(
    new Set(diarioItens.map(item => item.categoria))
  )

  return (
    <div className="space-y-4 p-4 pt-0">
      <h1 className="text-2xl font-bold text-[#ffbf00]">Gestão do Diário Oficial</h1>
      
      {/* Alertas */}
      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <p>{errorMessage}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded flex items-center gap-2">
          <Check className="h-4 w-4" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#ffbf00]">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título, conteúdo ou autor..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                className="w-full p-2 rounded-md border bg-background"
                value={categoriaFiltro}
                onChange={e => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Listagem */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#ffbf00]">Publicações</CardTitle>
          <Button onClick={handleAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Publicação
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">
                    <div 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("titulo")}
                    >
                      Título
                      {sortConfig.key === "titulo" && (
                        sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th className="p-2 text-left font-medium">
                    <div 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("categoria")}
                    >
                      Categoria
                      {sortConfig.key === "categoria" && (
                        sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th className="p-2 text-left font-medium">
                    <div 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("data")}
                    >
                      Data
                      {sortConfig.key === "data" && (
                        sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th className="p-2 text-left font-medium">
                    <div 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("publicadoPor")}
                    >
                      Publicado Por
                      {sortConfig.key === "publicadoPor" && (
                        sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th className="p-2 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiario.length > 0 ? (
                  filteredDiario.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.titulo}</td>
                      <td className="p-2">{item.categoria}</td>
                      <td className="p-2">
                        {format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-2">{item.publicadoPor}</td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-2 text-center">
                      Nenhuma publicação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Adição */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Publicação</DialogTitle>
            <DialogDescription>
              Adicione uma nova publicação ao Diário Oficial
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="titulo" className="mb-1 block">
                Título
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="categoria" className="mb-1 block">
                Categoria
              </Label>
              <Input
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                placeholder="Ex: Administrativo, Regimento, Seleção"
              />
            </div>
            
            <div>
              <Label htmlFor="data" className="mb-1 block">
                Data
              </Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="conteudo" className="mb-1 block">
                Conteúdo
              </Label>
              <Textarea
                id="conteudo"
                name="conteudo"
                rows={5}
                value={formData.conteudo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Publicação</DialogTitle>
            <DialogDescription>
              Edite os dados da publicação selecionada
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="titulo" className="mb-1 block">
                Título
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="categoria" className="mb-1 block">
                Categoria
              </Label>
              <Input
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="data" className="mb-1 block">
                Data
              </Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="conteudo" className="mb-1 block">
                Conteúdo
              </Label>
              <Textarea
                id="conteudo"
                name="conteudo"
                rows={5}
                value={formData.conteudo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentDiario?.titulo}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-between text-sm mt-1">
                <span>Categoria: {currentDiario?.categoria}</span>
                <span>
                  {currentDiario?.data && format(new Date(currentDiario.data), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="whitespace-pre-wrap">{currentDiario?.conteudo}</p>
          </div>
          
          <div className="text-sm text-muted-foreground mt-4">
            Publicado por: {currentDiario?.publicadoPor}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p><strong>Título:</strong> {currentDiario?.titulo}</p>
            <p><strong>Categoria:</strong> {currentDiario?.categoria}</p>
            <p><strong>Data:</strong> {currentDiario?.data && format(new Date(currentDiario.data), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 