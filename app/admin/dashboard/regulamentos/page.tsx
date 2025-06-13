"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Search, SortAsc, SortDesc, PlusCircle, 
  Edit, Trash2, FileText, Download, 
  AlertTriangle, Check 
} from "lucide-react"

import {
  Card,
  CardContent,
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

interface Regulamento {
  id: string
  titulo: string
  descricao: string
  versao: string
  dataPublicacao: string
  arquivoUrl?: string
  categoria: string
  publicadoPor: string
}

export default function RegulamentosPage() {
  // Estado do administrador atual
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [regulamentos, setRegulamentos] = useState<Regulamento[]>([
    {
      id: "1",
      titulo: "Regimento Interno",
      descricao: "Regimento interno da corporação com todas as normas de conduta e procedimentos administrativos.",
      versao: "2.0",
      dataPublicacao: "2023-01-15",
      arquivoUrl: "/regulamentos/regimento-interno-v2.pdf",
      categoria: "Institucional",
      publicadoPor: "Cel. Moreira"
    },
    {
      id: "2",
      titulo: "Manual de Procedimentos Operacionais",
      descricao: "Procedimentos padrão para operações táticas e atividades em campo.",
      versao: "1.5",
      dataPublicacao: "2023-04-10",
      arquivoUrl: "/regulamentos/manual-procedimentos.pdf",
      categoria: "Operacional",
      publicadoPor: "Ten. Cel. Santos"
    },
    {
      id: "3",
      titulo: "Código de Ética e Conduta",
      descricao: "Normas éticas e de conduta para todos os membros da corporação.",
      versao: "3.1",
      dataPublicacao: "2022-11-20",
      arquivoUrl: "/regulamentos/codigo-etica.pdf",
      categoria: "Ética",
      publicadoPor: "Maj. Oliveira"
    }
  ])

  // Estados para gerenciar carregamento e mensagens
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Estados para filtragem e ordenação
  const [filteredRegulamentos, setFilteredRegulamentos] = useState<Regulamento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Regulamento
    direction: "asc" | "desc"
  }>({ key: "dataPublicacao", direction: "desc" })

  // Estados para manipulação do modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentRegulamento, setCurrentRegulamento] = useState<Regulamento | null>(null)
  
  // Estado para formulário
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    descricao: "",
    versao: "",
    dataPublicacao: "",
    arquivoUrl: "",
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
    let result = [...regulamentos]

    if (searchTerm) {
      result = result.filter(
        item => 
          item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredRegulamentos(result)
  }, [regulamentos, searchTerm, categoriaFiltro, sortConfig])

  // Funções para manipulação de dados
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Em um cenário real, o arquivo seria enviado para um servidor
      // e o URL retornado seria salvo no estado
      const fileName = e.target.files[0].name
      setFormData(prev => ({ 
        ...prev, 
        arquivoUrl: `/regulamentos/${fileName}` 
      }))
    }
  }

  const handleSort = (key: keyof Regulamento) => {
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
      descricao: "",
      versao: "1.0",
      dataPublicacao: format(new Date(), "yyyy-MM-dd"),
      arquivoUrl: "",
      categoria: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (item: Regulamento) => {
    setFormData({
      id: item.id,
      titulo: item.titulo,
      descricao: item.descricao,
      versao: item.versao,
      dataPublicacao: item.dataPublicacao,
      arquivoUrl: item.arquivoUrl || "",
      categoria: item.categoria,
    })
    setCurrentRegulamento(item)
    setIsEditModalOpen(true)
  }

  const handleView = (item: Regulamento) => {
    setCurrentRegulamento(item)
    setIsViewModalOpen(true)
  }

  const handleDelete = (item: Regulamento) => {
    setCurrentRegulamento(item)
    setIsDeleteModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.titulo || !formData.descricao || !formData.versao || !formData.dataPublicacao || !formData.categoria) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
      })
      return
    }

    try {
      setIsLoading(true)
      
      if (isAddModalOpen) {
        // Simular adição de novo item
        const newItem: Regulamento = {
          id: Math.random().toString(36).substring(2, 9),
          ...formData,
          publicadoPor: currentAdmin?.nome || "Admin",
        }
        
        setRegulamentos(prev => [...prev, newItem])
        toast({
          title: "Sucesso",
          description: "Regulamento adicionado com sucesso!",
        })
        setIsAddModalOpen(false)
      }
      
      if (isEditModalOpen && currentRegulamento) {
        // Simular edição de item existente
        setRegulamentos(prev =>
          prev.map(item =>
            item.id === currentRegulamento.id
              ? {
                  ...item,
                  titulo: formData.titulo,
                  descricao: formData.descricao,
                  versao: formData.versao,
                  dataPublicacao: formData.dataPublicacao,
                  arquivoUrl: formData.arquivoUrl,
                  categoria: formData.categoria,
                }
              : item
          )
        )
        toast({
          title: "Sucesso",
          description: "Regulamento atualizado com sucesso!",
        })
        setIsEditModalOpen(false)
      }
    } catch (error) {
      console.error("Erro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o regulamento.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = () => {
    if (!currentRegulamento) return
    
    try {
      setIsLoading(true)
      
      // Simular exclusão
      setRegulamentos(prev => prev.filter(item => item.id !== currentRegulamento.id))
      
      toast({
        title: "Sucesso",
        description: "Regulamento excluído com sucesso!",
      })
    } catch (error) {
      console.error("Erro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao excluir o regulamento.",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleDownload = (arquivoUrl: string) => {
    // Em um cenário real, isto iniciaria o download do arquivo
    toast({
      title: "Download iniciado",
      description: "O download do arquivo foi iniciado.",
    })
  }

  // Obter categorias únicas para o filtro
  const categorias = Array.from(
    new Set(regulamentos.map(item => item.categoria))
  )

  return (
    <div className="space-y-4 p-4 pt-0">
      <h1 className="text-2xl font-bold text-[#ffbf00]">Gestão de Regulamentos</h1>
      
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
                  placeholder="Buscar por título, descrição ou categoria..."
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
          <CardTitle className="text-[#ffbf00]">Regulamentos</CardTitle>
          <Button onClick={handleAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Regulamento
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
                      onClick={() => handleSort("versao")}
                    >
                      Versão
                      {sortConfig.key === "versao" && (
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
                      onClick={() => handleSort("dataPublicacao")}
                    >
                      Data
                      {sortConfig.key === "dataPublicacao" && (
                        sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th className="p-2 text-center font-medium">Arquivo</th>
                  <th className="p-2 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegulamentos.length > 0 ? (
                  filteredRegulamentos.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.titulo}</td>
                      <td className="p-2">{item.categoria}</td>
                      <td className="p-2">{item.versao}</td>
                      <td className="p-2">
                        {format(new Date(item.dataPublicacao), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-2 text-center">
                        {item.arquivoUrl ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(item.arquivoUrl || "")}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sem arquivo</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(item)}
                          >
                            <FileText className="h-4 w-4" />
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
                    <td colSpan={6} className="p-2 text-center">
                      Nenhum regulamento encontrado.
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
            <DialogTitle>Novo Regulamento</DialogTitle>
            <DialogDescription>
              Adicione um novo regulamento ao sistema
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
                placeholder="Ex: Institucional, Operacional, Ética"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="versao" className="mb-1 block">
                  Versão
                </Label>
                <Input
                  id="versao"
                  name="versao"
                  value={formData.versao}
                  onChange={handleInputChange}
                  placeholder="Ex: 1.0"
                />
              </div>
              
              <div>
                <Label htmlFor="dataPublicacao" className="mb-1 block">
                  Data de Publicação
                </Label>
                <Input
                  id="dataPublicacao"
                  name="dataPublicacao"
                  type="date"
                  value={formData.dataPublicacao}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="descricao" className="mb-1 block">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="arquivo" className="mb-1 block">
                Arquivo (PDF)
              </Label>
              <Input
                id="arquivo"
                name="arquivo"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
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
            <DialogTitle>Editar Regulamento</DialogTitle>
            <DialogDescription>
              Edite os dados do regulamento selecionado
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="versao" className="mb-1 block">
                  Versão
                </Label>
                <Input
                  id="versao"
                  name="versao"
                  value={formData.versao}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="dataPublicacao" className="mb-1 block">
                  Data de Publicação
                </Label>
                <Input
                  id="dataPublicacao"
                  name="dataPublicacao"
                  type="date"
                  value={formData.dataPublicacao}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="descricao" className="mb-1 block">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="arquivo" className="mb-1 block">
                Arquivo (PDF)
              </Label>
              <Input
                id="arquivo"
                name="arquivo"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {formData.arquivoUrl && (
                <p className="text-sm text-muted-foreground mt-1">
                  Arquivo atual: {formData.arquivoUrl.split('/').pop()}
                </p>
              )}
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
            <DialogTitle>{currentRegulamento?.titulo}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-between text-sm mt-1">
                <span>Categoria: {currentRegulamento?.categoria}</span>
                <span>Versão: {currentRegulamento?.versao}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <p className="font-semibold">Descrição:</p>
            <p className="text-sm">{currentRegulamento?.descricao}</p>
            
            <div className="flex justify-between text-sm mt-4">
              <div>
                <p className="font-semibold">Data de Publicação:</p>
                <p>
                  {currentRegulamento?.dataPublicacao && 
                    format(new Date(currentRegulamento.dataPublicacao), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="font-semibold">Publicado por:</p>
                <p>{currentRegulamento?.publicadoPor}</p>
              </div>
            </div>
            
            {currentRegulamento?.arquivoUrl && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => handleDownload(currentRegulamento.arquivoUrl || "")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download do Documento
                </Button>
              </div>
            )}
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
              Tem certeza que deseja excluir este regulamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p><strong>Título:</strong> {currentRegulamento?.titulo}</p>
            <p><strong>Categoria:</strong> {currentRegulamento?.categoria}</p>
            <p><strong>Versão:</strong> {currentRegulamento?.versao}</p>
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