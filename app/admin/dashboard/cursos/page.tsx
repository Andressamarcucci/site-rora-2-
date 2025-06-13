"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AlertCircle, Check, Info, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/types"
import { ExclamationTriangleIcon, CheckCircledIcon, Cross2Icon, TrashIcon, Pencil1Icon, ClockIcon, PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { fetchAdminData } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Interface para o tipo Curso
interface Curso {
  id: string
  titulo: string
  descricao: string
  imagem: string
  data: string
  status: "disponivel" | "indisponivel"
  instrutor: string
  duracao: string
  categoria: string
  links?: string[]
  arquivos?: {
    nome: string
    url: string
    tipo: string
  }[]
  vagas?: number
  vagasPreenchidas?: number
  inscritos?: string[] // IDs dos usuários inscritos
  linkInscricao?: string
}

interface Inscricao {
  id: string
  cursoId: string
  cursoTitulo: string
  userId: string
  userName: string
  userRank: string
  status: "pendente" | "aprovada" | "rejeitada"
  data: string
}

// Dados iniciais para demonstração
const cursosIniciais: Curso[] = [
  {
    id: "1",
    titulo: "Abordagem Policial Avançada",
    descricao: "Curso focado em técnicas avançadas de abordagem policial para situações de alto risco.",
    imagem: "https://placehold.co/600x400/png",
    data: "2023-08-15",
    status: "disponivel",
    instrutor: "Cap. Silva",
    duracao: "20h",
    categoria: "Operacional",
    vagas: 20,
    vagasPreenchidas: 8,
    inscritos: [],
    linkInscricao: "https://forms.gle/exampleLink"
  },
  {
    id: "2",
    titulo: "Primeiros Socorros Táticos",
    descricao: "Aprenda técnicas de primeiros socorros aplicáveis em situações táticas e de emergência.",
    imagem: "https://placehold.co/600x400/png",
    data: "2023-09-10",
    status: "disponivel",
    instrutor: "Ten. Oliveira",
    duracao: "15h",
    categoria: "Saúde",
    linkInscricao: "https://forms.gle/exampleLink"
  },
  {
    id: "3",
    titulo: "Direito Penal Aplicado",
    descricao: "Estudo aprofundado do código penal com foco na aplicação prática para policiais.",
    imagem: "https://placehold.co/600x400/png",
    data: "2023-07-20",
    status: "indisponivel",
    instrutor: "Dr. Mendes",
    duracao: "30h",
    categoria: "Jurídico",
    linkInscricao: "https://forms.gle/exampleLink"
  }
]

export default function CursosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [cursos, setCursos] = useState<Curso[]>(cursosIniciais)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Estados para filtros e ordenação
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("todas")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [sortField, setSortField] = useState<keyof Curso>("titulo")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  
  // Estados para modais
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Estado para o curso atual sendo editado/adicionado/excluído
  const [currentCurso, setCurrentCurso] = useState<Partial<Curso>>({
    titulo: "",
    descricao: "",
    imagem: "",
    data: "",
    status: "disponivel",
    instrutor: "",
    duracao: "",
    categoria: "",
    links: [],
    arquivos: [],
    linkInscricao: ""
  })
  
  // Novos estados para gerenciar links e arquivos
  const [novoLink, setNovoLink] = useState("")
  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null)
  
  // Adicionar novo estado para as inscrições
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [activeTab, setActiveTab] = useState("cursos")
  
  // Efeito para carregar dados do localStorage e atualizar o estado quando outros componentes modificarem o localStorage
  useEffect(() => {
    // Carregar admin
    const userSalvo = localStorage.getItem("currentAdmin")
    if (userSalvo) {
      setCurrentAdmin(JSON.parse(userSalvo))
    }
    
    // Carregar cursos
    const savedCursos = localStorage.getItem("cursos")
    if (savedCursos) {
      setCursos(JSON.parse(savedCursos))
    } else {
      // Se não existir, inicializar com os dados padrão
      localStorage.setItem("cursos", JSON.stringify(cursosIniciais))
      setCursos(cursosIniciais)
    }
    
    // Adicionar listener para atualizar quando o localStorage mudar em outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cursos") {
        const updatedCursos = e.newValue ? JSON.parse(e.newValue) : []
        setCursos(updatedCursos)
      }
      
      if (e.key === "inscricoesCursos") {
        const updatedInscricoes = e.newValue ? JSON.parse(e.newValue) : []
        setInscricoes(updatedInscricoes)
      }
    }
    
    // Registrar o listener
    window.addEventListener("storage", handleStorageChange)
    
    // Remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])
  
  // Efeito para salvar cursos no localStorage sempre que o estado for atualizado
  useEffect(() => {
    if (cursos.length > 0) {
      localStorage.setItem("cursos", JSON.stringify(cursos))
    }
  }, [cursos])
  
  // Handler para mudar inputs do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === "cargaHoraria" || name === "vagas") {
      setCurrentCurso({
        ...currentCurso,
        [name]: parseInt(value, 10) || 0
      })
    } else {
      setCurrentCurso({
        ...currentCurso,
        [name]: value
      })
    }
  }
  
  // Handler para mudança de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setCurrentCurso({
            ...currentCurso,
            imagem: event.target.result as string
          })
        }
      }
      
      reader.readAsDataURL(file)
    }
  }
  
  // Handler para adicionar curso
  const handleAddCurso = () => {
    setCurrentCurso({
      titulo: "",
      descricao: "",
      imagem: "",
      data: "",
      status: "disponivel",
      instrutor: "",
      duracao: "",
      categoria: "",
      links: [],
      arquivos: [],
      linkInscricao: ""
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }
  
  // Handler para editar curso
  const handleEditCurso = (curso: Curso) => {
    setCurrentCurso(curso)
    setIsEditing(true)
    setIsDialogOpen(true)
  }
  
  // Handler para excluir curso
  const handleDeleteCurso = (curso: Curso) => {
    setCurrentCurso(curso)
    setIsDeleteDialogOpen(true)
  }
  
  // Handler para salvar curso
  const handleSaveCurso = () => {
    setIsLoading(true)
    try {
      if (!currentCurso.titulo || !currentCurso.descricao || !currentCurso.instrutor) {
        setError("Preencha todos os campos obrigatórios.")
        setIsLoading(false)
        return
      }
      
      if (isEditing) {
        // Atualizar curso existente
        const updatedCursos = cursos.map(c => 
          c.id === currentCurso.id ? currentCurso : c
        )
        setCursos(updatedCursos)
        // Atualizar no localStorage
        localStorage.setItem("cursos", JSON.stringify(updatedCursos))
        setSuccess("Curso atualizado com sucesso!")
      } else {
        // Adicionar novo curso
        const newCurso = {
          ...currentCurso,
          id: uuidv4(),
          vagasPreenchidas: 0,
          inscritos: [],
          createdAt: new Date().toISOString()
        }
        
        const updatedCursos = [...cursos, newCurso]
        setCursos(updatedCursos)
        // Atualizar no localStorage
        localStorage.setItem("cursos", JSON.stringify(updatedCursos))
        setSuccess("Curso adicionado com sucesso!")
      }
      
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar curso:", error)
      setError("Ocorreu um erro ao salvar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handler para confirmar exclusão
  const handleConfirmDelete = () => {
    try {
      const updatedCursos = cursos.filter(curso => curso.id !== currentCurso.id)
      setCursos(updatedCursos)
      // Atualizar no localStorage
      localStorage.setItem("cursos", JSON.stringify(updatedCursos))
      setSuccess("Curso excluído com sucesso!")
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Erro ao excluir curso:", error)
      setError("Ocorreu um erro ao excluir. Tente novamente.")
    }
  }
  
  // Handler para ordenação
  const handleSort = (field: keyof Curso) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)
  }
  
  // Filtrar e ordenar cursos
  const filteredCursos = cursos
    .filter(curso => 
      (searchQuery === "" || 
        curso.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curso.instrutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (categoryFilter === "todas" || curso.categoria === categoryFilter) &&
      (statusFilter === "todos" || curso.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortField === "titulo" || sortField === "instrutor" || sortField === "descricao") {
        return sortDirection === "asc" 
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField])
      } else if (sortField === "data") {
        return sortDirection === "asc"
          ? new Date(a.data).getTime() - new Date(b.data).getTime()
          : new Date(b.data).getTime() - new Date(a.data).getTime()
      }
      return 0
    })
  
  // Obter categorias únicas para o filtro
  const categorias = Array.from(new Set(cursos.map(curso => curso.categoria)))

  // Função para adicionar link
  const handleAddLink = () => {
    if (!novoLink) return;
    
    setCurrentCurso(prev => ({
      ...prev,
      links: [...(prev.links || []), novoLink]
    }));
    
    setNovoLink("");
  }

  // Função para remover link
  const handleRemoveLink = (index: number) => {
    setCurrentCurso(prev => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index)
    }));
  }

  // Função para lidar com upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoUpload(e.target.files[0]);
    }
  }

  // Função para adicionar arquivo
  const handleAddFile = () => {
    if (!arquivoUpload) return;
    
    // Em produção, você faria upload do arquivo para um servidor/storage
    // Aqui estamos apenas simulando o processo
    const novoArquivo = {
      nome: arquivoUpload.name,
      url: URL.createObjectURL(arquivoUpload),
      tipo: arquivoUpload.type
    };
    
    setCurrentCurso(prev => ({
      ...prev,
      arquivos: [...(prev.arquivos || []), novoArquivo]
    }));
    
    setArquivoUpload(null);
    
    // Resetar o input de arquivo
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // Função para remover arquivo
  const handleRemoveFile = (index: number) => {
    setCurrentCurso(prev => ({
      ...prev,
      arquivos: (prev.arquivos || []).filter((_, i) => i !== index)
    }));
  }

  // Função para aprovar inscrição
  const aprovarInscricao = (inscricao: Inscricao) => {
    const inscricaoAtualizada = { ...inscricao, status: "aprovada" }
    
    const novasInscricoes = inscricoes.map(i => 
      i.id === inscricao.id ? inscricaoAtualizada : i
    )
    
    setInscricoes(novasInscricoes)
    localStorage.setItem("inscricoesCursos", JSON.stringify(novasInscricoes))
    
    toast({
      title: "Inscrição aprovada",
      description: `A inscrição de ${inscricao.userName} foi aprovada com sucesso.`,
    })
  }

  // Função para rejeitar inscrição
  const rejeitarInscricao = (inscricao: Inscricao) => {
    const inscricaoAtualizada = { ...inscricao, status: "rejeitada" }
    
    const novasInscricoes = inscricoes.map(i => 
      i.id === inscricao.id ? inscricaoAtualizada : i
    )
    
    setInscricoes(novasInscricoes)
    localStorage.setItem("inscricoesCursos", JSON.stringify(novasInscricoes))
    
    // Atualizar vagas preenchidas no curso
    const cursoRelacionado = cursos.find(c => c.id === inscricao.cursoId)
    if (cursoRelacionado && inscricao.status === "pendente") {
      const cursoAtualizado = {
        ...cursoRelacionado,
        vagasPreenchidas: Math.max(0, (cursoRelacionado.vagasPreenchidas || 0) - 1)
      }
      
      const cursosAtualizados = cursos.map(c => 
        c.id === inscricao.cursoId ? cursoAtualizado : c
      )
      
      setCursos(cursosAtualizados)
      localStorage.setItem("cursos", JSON.stringify(cursosAtualizados))
    }
    
    toast({
      title: "Inscrição rejeitada",
      description: `A inscrição de ${inscricao.userName} foi rejeitada.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-[#ffbf00]">Gestão de Cursos</h1>
        <p className="text-rota-darkgold">
          Gerencie os cursos e treinamentos disponíveis para os policiais.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="bg-green-700/20 border-green-700">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Sucesso</AlertTitle>
          <AlertDescription className="text-green-500">{success}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-rota-black border border-rota-darkgold">
          <TabsTrigger 
            value="cursos" 
            className="data-[state=active]:bg-rota-gold data-[state=active]:text-black"
          >
            Cursos
          </TabsTrigger>
          <TabsTrigger 
            value="inscricoes" 
            className="data-[state=active]:bg-rota-gold data-[state=active]:text-black"
          >
            Inscrições
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cursos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filtros */}
            <Card className="col-span-1 border-rota-darkgold">
              <CardHeader>
                <CardTitle className="text-[#ffbf00]">Filtros</CardTitle>
                <CardDescription className="text-rota-darkgold">
                  Filtre os cursos por categoria, status ou pesquise por nome.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-rota-gold">Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-rota-darkgold" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Nome, instrutor ou descrição..."
                      className="pl-9 bg-rota-gray border-rota-darkgold text-rota-gold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-rota-gold">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category" className="bg-rota-gray border-rota-darkgold text-rota-gold">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                      <SelectItem value="todas">Todas as categorias</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-rota-gold">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status" className="bg-rota-gray border-rota-darkgold text-rota-gold">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="indisponivel">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("todas")
                    setStatusFilter("todos")
                  }}
                  className="w-full border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
                >
                  Limpar filtros
                </Button>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddCurso}
                  className="w-full bg-rota-gold text-black hover:bg-rota-darkgold"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Curso
                </Button>
              </CardFooter>
            </Card>
            
            {/* Lista de Cursos */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              {filteredCursos.length === 0 ? (
                <Card className="border-rota-darkgold">
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
                    <Info className="h-12 w-12 text-rota-darkgold mb-4" />
                    <p className="text-rota-gold text-center">Nenhum curso encontrado com os filtros selecionados.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchQuery("")
                        setCategoryFilter("todas")
                        setStatusFilter("todos")
                      }}
                      className="mt-2 text-rota-gold hover:text-rota-darkgold"
                    >
                      Limpar filtros
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredCursos.map(curso => (
                    <Card key={curso.id} className="border-rota-darkgold overflow-hidden">
                      <div className="flex flex-col h-full overflow-hidden">
                        {curso.imagem && (
                          <div className="w-full h-[200px] relative overflow-hidden">
                            <Image
                              src={curso.imagem}
                              alt={curso.titulo}
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 z-10">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                curso.status === "disponivel" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {curso.status === "disponivel" 
                                  ? "Disponível" 
                                  : "Indisponível"}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex-1 p-4 flex flex-col bg-rota-black">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-2">
                              <h3 className="text-lg font-bold text-[#ffbf00]">{curso.titulo}</h3>
                              <p className="text-xs text-rota-darkgold mb-1">
                                Instrutor: {curso.instrutor} | Duração: {curso.duracao}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditCurso(curso)}
                                className="text-rota-gold hover:bg-rota-gray/50"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCurso(curso)}
                                className="text-red-500 hover:bg-rota-gray/50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rota-gray text-rota-gold">
                              {curso.categoria}
                            </span>
                            {curso.vagas && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rota-gray/50 text-rota-gold">
                                Vagas: {curso.vagasPreenchidas || 0}/{curso.vagas}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-rota-gold">{curso.descricao}</p>
                          
                          {/* Links e Arquivos */}
                          {(curso.links?.length > 0 || curso.arquivos?.length > 0) && (
                            <div className="mt-2 border-t border-rota-darkgold pt-2">
                              {curso.links && curso.links.length > 0 && (
                                <div className="mb-2">
                                  <h4 className="text-xs font-semibold text-rota-gold mb-1">Links relacionados:</h4>
                                  <ul className="list-disc list-inside text-blue-400 pl-1">
                                    {curso.links.map((link, index) => (
                                      <li key={index} className="text-xs">
                                        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate inline-block max-w-[250px]">
                                          {link}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {curso.arquivos && curso.arquivos.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-rota-gold mb-1">Materiais disponíveis:</h4>
                                  <ul className="space-y-1">
                                    {curso.arquivos.map((arquivo, index) => (
                                      <li key={index} className="text-sm flex items-center">
                                        <a 
                                          href={arquivo.url} 
                                          download={arquivo.nome}
                                          className="text-blue-400 hover:underline flex items-center"
                                        >
                                          {arquivo.tipo.includes('pdf') ? (
                                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                              <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"/>
                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.686 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"/>
                                            </svg>
                                          ) : arquivo.tipo.includes('word') ? (
                                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-7 2h4v2h-4V4zm9 16H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8v-2h8v2zm.5-5.9V8h2.8L16.5 6.1z"/>
                                            </svg>
                                          ) : (
                                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                                            </svg>
                                          )}
                                          {arquivo.nome}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-auto pt-2 text-xs text-rota-darkgold">
                            Data: {new Date(curso.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inscricoes" className="mt-4">
          <Card className="border-rota-darkgold">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Gerenciar Inscrições</CardTitle>
              <CardDescription className="text-rota-darkgold">
                Aprove ou rejeite as inscrições dos policiais nos cursos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inscricoes.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="h-10 w-10 mx-auto text-rota-darkgold mb-4" />
                  <p className="text-rota-gold">Nenhuma inscrição encontrada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-rota-black border border-rota-darkgold rounded-md">
                    <div className="grid grid-cols-7 gap-4 px-4 py-3 border-b border-rota-darkgold text-xs font-medium text-rota-gold">
                      <div className="col-span-2">Curso</div>
                      <div className="col-span-2">Policial</div>
                      <div>Data</div>
                      <div>Status</div>
                      <div>Ações</div>
                    </div>
                    <div className="divide-y divide-rota-darkgold">
                      {inscricoes.map((inscricao) => (
                        <div key={inscricao.id} className="grid grid-cols-7 gap-4 px-4 py-3 text-sm">
                          <div className="col-span-2 text-rota-gold">{inscricao.cursoTitulo}</div>
                          <div className="col-span-2 text-rota-darkgold">
                            <div>{inscricao.userName}</div>
                            <div className="text-xs text-rota-darkgold/70">{inscricao.userRank}</div>
                          </div>
                          <div className="text-rota-darkgold">
                            {new Date(inscricao.data).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <Badge 
                              variant={
                                inscricao.status === "aprovada" 
                                  ? "success" 
                                  : inscricao.status === "rejeitada" 
                                    ? "destructive" 
                                    : "outline"
                              }
                            >
                              {inscricao.status === "aprovada" 
                                ? "Aprovada" 
                                : inscricao.status === "rejeitada" 
                                  ? "Rejeitada" 
                                  : "Pendente"}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            {inscricao.status === "pendente" && (
                              <>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-green-500 hover:text-green-600 hover:bg-green-100/20"
                                  onClick={() => aprovarInscricao(inscricao)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                                  onClick={() => rejeitarInscricao(inscricao)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Adicionar/Editar Curso */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{isEditing ? "Editar Curso" : "Adicionar Curso"}</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              {isEditing 
                ? "Altere os detalhes do curso conforme necessário." 
                : "Preencha os detalhes para adicionar um novo curso."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 overflow-y-auto pr-2 flex-grow">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-rota-gold">Título*</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  placeholder="Título do curso"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                  value={currentCurso.titulo || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-rota-gold">Categoria*</Label>
                <Select 
                  name="categoria" 
                  value={currentCurso.categoria} 
                  onValueChange={(value) => setCurrentCurso({...currentCurso, categoria: value as Curso["categoria"]})}>
                  <SelectTrigger id="categoria" className="bg-rota-black border-rota-darkgold text-rota-gold">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instrutor" className="text-rota-gold">Instrutor*</Label>
                <Input
                  id="instrutor"
                  name="instrutor"
                  placeholder="Nome do instrutor"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                  value={currentCurso.instrutor || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data" className="text-rota-gold">Data*</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  placeholder="Data do curso"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                  value={currentCurso.data || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duracao" className="text-rota-gold">Duração*</Label>
                <Input
                  id="duracao"
                  name="duracao"
                  placeholder="Duração do curso"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                  value={currentCurso.duracao || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-rota-gold">Status*</Label>
              <Select 
                name="status" 
                value={currentCurso.status} 
                onValueChange={(value) => setCurrentCurso({...currentCurso, status: value as Curso["status"]})}>
                <SelectTrigger id="status" className="bg-rota-black border-rota-darkgold text-rota-gold">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="indisponivel">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-rota-gold">Descrição*</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descrição detalhada do curso"
                className="bg-rota-black border-rota-darkgold text-rota-gold h-24 resize-none"
                value={currentCurso.descricao || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imagem" className="text-rota-gold">Imagem</Label>
              <Input
                id="imagem"
                name="imagem"
                type="file"
                accept="image/*"
                className="bg-rota-black border-rota-darkgold text-rota-gold"
                onChange={handleImageChange}
              />
              {currentCurso.imagem && (
                <div className="mt-2 h-[180px] w-[180px] rounded-md border border-rota-darkgold bg-black/5 flex items-center justify-center">
                  <Image
                    src={currentCurso.imagem}
                    alt="Preview"
                    width={160}
                    height={160}
                    className="object-contain max-h-[160px] max-w-[160px]"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vagas" className="text-rota-gold">Vagas Disponíveis</Label>
                <Input
                  id="vagas"
                  name="vagas"
                  type="number"
                  min="1"
                  placeholder="Número de vagas"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                  value={currentCurso.vagas || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vagasPreenchidas" className="text-rota-gold">Vagas Preenchidas</Label>
                <Input
                  id="vagasPreenchidas"
                  name="vagasPreenchidas"
                  type="number"
                  min="0"
                  placeholder="Vagas já preenchidas"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                  value={currentCurso.vagasPreenchidas || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkInscricao" className="text-rota-gold">Link do Google Forms para Inscrição</Label>
              <Input
                id="linkInscricao"
                name="linkInscricao"
                placeholder="Cole aqui o link do Google Forms para inscrição do curso"
                className="bg-rota-black border-rota-darkgold text-rota-gold"
                value={currentCurso.linkInscricao || ""}
                onChange={e => setCurrentCurso({ ...currentCurso, linkInscricao: e.target.value })}
              />
              <span className="text-xs text-rota-darkgold">Esse link será exibido para os policiais se inscreverem neste curso.</span>
            </div>
            
            {/* Links */}
            <div className="space-y-2 border-t border-rota-darkgold pt-4 mt-4">
              <Label className="text-rota-gold">Links Relacionados</Label>
              
              <div className="flex space-x-2">
                <Input
                  value={novoLink}
                  onChange={(e) => setNovoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                />
                <Button 
                  type="button" 
                  onClick={handleAddLink}
                  className="bg-rota-gold text-black hover:bg-rota-darkgold"
                  disabled={!novoLink}
                >
                  Adicionar
                </Button>
              </div>
              
              {currentCurso.links && currentCurso.links.length > 0 && (
                <div className="mt-2 space-y-2">
                  {currentCurso.links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-rota-black p-2 rounded">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate max-w-[400px]">
                        {link}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLink(index)}
                        className="text-red-500 hover:bg-rota-gray/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Arquivos */}
            <div className="space-y-2">
              <Label className="text-rota-gold">Arquivos (PDF, Word, etc.)</Label>
              
              <div className="flex space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="bg-rota-black border-rota-darkgold text-rota-gold"
                />
                <Button 
                  type="button" 
                  onClick={handleAddFile}
                  className="bg-rota-gold text-black hover:bg-rota-darkgold"
                  disabled={!arquivoUpload}
                >
                  Adicionar
                </Button>
              </div>
              
              {currentCurso.arquivos && currentCurso.arquivos.length > 0 && (
                <div className="mt-2 space-y-2">
                  {currentCurso.arquivos.map((arquivo, index) => (
                    <div key={index} className="flex items-center justify-between bg-rota-black p-2 rounded">
                      <div className="flex items-center text-rota-gold text-sm">
                        {arquivo.tipo.includes('pdf') ? (
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"/>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.686 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"/>
                          </svg>
                        ) : arquivo.tipo.includes('word') || arquivo.tipo.includes('doc') ? (
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-7 2h4v2h-4V4zm9 16H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8v-2h8v2zm.5-5.9V8h2.8L16.5 6.1z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                          </svg>
                        )}
                        <span className="truncate max-w-[350px]">{arquivo.nome}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:bg-rota-gray/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex-shrink-0 mt-2 border-t border-rota-darkgold pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-rota-darkgold text-rota-gold hover:bg-rota-black"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveCurso}
              disabled={isLoading}
              className="bg-rota-gold text-black hover:bg-rota-darkgold"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              Tem certeza que deseja excluir o curso {currentCurso.titulo}? Esta ação não pode ser desfeita.
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