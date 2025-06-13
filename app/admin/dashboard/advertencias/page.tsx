"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, FileEditIcon, PlusIcon, SearchIcon, Trash2Icon, FilterIcon, XIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DatePicker } from "@/components/DatePicker"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { AlertSuccess } from "@/components/AlertSuccess"
import { AlertError } from "@/components/AlertError"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Advertencia {
  id: string
  policial: string
  policialId: string
  matricula: string
  rg: string
  graduacao: string
  motivo: string
  data: Date
  aplicadaPor: string
  status: "Ativa" | "Cumprida" | "Anulada"
  visualizada: boolean
}

interface Policial {
  id: string
  nome: string
  matricula: string
  patente: string
  graduacao: string
  rg: string
  unidade: string
  dataIngresso: string
}

const advertenciasIniciais: Advertencia[] = [
  {
    id: uuidv4(),
    policial: "João Silva",
    policialId: "1",
    matricula: "PM-12345",
    rg: "123456789",
    graduacao: "Soldado",
    motivo: "Não comparecimento à escala de patrulha",
    data: new Date(2023, 4, 15),
    aplicadaPor: "Capitão Rodrigues",
    status: "Ativa",
    visualizada: false
  },
  {
    id: uuidv4(),
    policial: "Maria Oliveira",
    policialId: "2",
    matricula: "PM-67890",
    rg: "987654321",
    graduacao: "Cabo",
    motivo: "Uso indevido de equipamento",
    data: new Date(2023, 5, 22),
    aplicadaPor: "Tenente Costa",
    status: "Cumprida",
    visualizada: false
  },
  {
    id: uuidv4(),
    policial: "Carlos Santos",
    policialId: "3",
    matricula: "PM-54321",
    rg: "456789123",
    graduacao: "Sargento",
    motivo: "Atraso recorrente para o serviço",
    data: new Date(2023, 3, 10),
    aplicadaPor: "Major Almeida",
    status: "Anulada",
    visualizada: false
  }
]

export default function AdvertenciasPage() {
  const { toast } = useToast()
  const [currentAdmin, setCurrentAdmin] = useState("Admin")
  const [advertencias, setAdvertencias] = useState<Advertencia[]>(advertenciasIniciais)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Estados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroData, setFiltroData] = useState<Date | undefined>(undefined)
  const [sortOption, setSortOption] = useState("selecione")

  // Estados para modais
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedAdvertencia, setSelectedAdvertencia] = useState<Advertencia | null>(null)

  // Estados para o formulário
  const [formData, setFormData] = useState({
    id: "",
    policial: "",
    rg: "",
    graduacao: "",
    motivo: "",
    data: new Date(),
    aplicadaPor: "",
    status: "selecione" as "selecione" | "Ativa" | "Cumprida" | "Anulada"
  })

  const [policiais, setPoliciais] = useState<Policial[]>([])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  // Carregar advertências do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem("advertencias")
    if (stored) {
      // Converter datas para objeto Date
      const advs = JSON.parse(stored).map((a: any) => ({
        ...a,
        data: a.data ? new Date(a.data) : new Date()
      }))
      setAdvertencias(advs)
    } else {
      setAdvertencias(advertenciasIniciais)
      localStorage.setItem("advertencias", JSON.stringify(advertenciasIniciais))
    }
  }, [])

  // Carregar lista de policiais do localStorage
  useEffect(() => {
    const storedPoliciais = localStorage.getItem("policiais")
    if (storedPoliciais) {
      setPoliciais(JSON.parse(storedPoliciais))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, data: date })
    }
  }

  const handleAddAdvertencia = () => {
    setFormData({
      id: "",
      policial: "",
      rg: "",
      graduacao: "",
      motivo: "",
      data: new Date(),
      aplicadaPor: currentAdmin,
      status: "selecione"
    })
    setValue("")
    setIsAddOpen(true)
  }

  const handleEditAdvertencia = (advertencia: Advertencia) => {
    setFormData(advertencia)
    setSelectedAdvertencia(advertencia)
    setIsEditOpen(true)
  }

  const handleViewAdvertencia = (advertencia: Advertencia) => {
    setSelectedAdvertencia(advertencia)
    setIsViewOpen(true)
  }

  const handleDeleteAdvertencia = (advertencia: Advertencia) => {
    setSelectedAdvertencia(advertencia)
    setIsDeleteOpen(true)
  }

  const handleSaveAdvertencia = () => {
    setIsLoading(true)
    setErrorMessage("")
    
    if (!formData.policial || !formData.rg || !formData.graduacao || !formData.motivo || formData.status === "selecione") {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
      setIsLoading(false)
      return
    }

    try {
      let novasAdvertencias = advertencias
      if (isAddOpen) {
        const newAdvertencia: Advertencia = {
          ...formData,
          id: uuidv4(),
          aplicadaPor: currentAdmin
        }
        novasAdvertencias = [...advertencias, newAdvertencia]
        setAdvertencias(novasAdvertencias)
        setSuccessMessage("Advertência adicionada com sucesso!")
        setIsAddOpen(false)
      } else if (isEditOpen && selectedAdvertencia) {
        novasAdvertencias = advertencias.map(adv => adv.id === selectedAdvertencia.id ? { ...formData } : adv)
        setAdvertencias(novasAdvertencias)
        setSuccessMessage("Advertência atualizada com sucesso!")
        setIsEditOpen(false)
      }
      localStorage.setItem("advertencias", JSON.stringify(novasAdvertencias))
      
      toast({
        title: "Sucesso",
        description: isAddOpen ? "Advertência adicionada com sucesso!" : "Advertência atualizada com sucesso!",
      })
    } catch (error) {
      setErrorMessage("Ocorreu um erro ao salvar a advertência.")
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar a advertência.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteAdvertencia = () => {
    if (selectedAdvertencia) {
      const filteredAdvertencias = advertencias.filter(adv => adv.id !== selectedAdvertencia.id)
      setAdvertencias(filteredAdvertencias)
      setIsDeleteOpen(false)
      setSuccessMessage("Advertência excluída com sucesso!")
      localStorage.setItem("advertencias", JSON.stringify(filteredAdvertencias))
      toast({
        title: "Sucesso",
        description: "Advertência excluída com sucesso!",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa": return "bg-yellow-100 text-yellow-800"
      case "Cumprida": return "bg-green-100 text-green-800"
      case "Anulada": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Ajustar filtro e ordenação para aceitar data como string ou Date
  const filteredAdvertencias = advertencias
    .filter(adv => {
      const advData = adv.data instanceof Date ? adv.data : new Date(adv.data)
      const matchesSearch = 
        adv.policial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adv.motivo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filtroStatus === "todos" ? true : adv.status === filtroStatus
      const matchesData = filtroData 
        ? advData.toDateString() === filtroData.toDateString()
        : true
      return matchesSearch && matchesStatus && matchesData
    })
    .sort((a, b) => {
      const aData = a.data instanceof Date ? a.data : new Date(a.data)
      const bData = b.data instanceof Date ? b.data : new Date(b.data)
      switch (sortOption) {
        case "data-asc":
          return aData.getTime() - bData.getTime()
        case "data-desc":
          return bData.getTime() - aData.getTime()
        case "policial-asc":
          return a.policial.localeCompare(b.policial)
        case "policial-desc":
          return b.policial.localeCompare(a.policial)
        default:
          return 0
      }
    })

  const clearFilters = () => {
    setSearchTerm("")
    setFiltroStatus("todos")
    setFiltroData(undefined)
    setSortOption("selecione")
  }

  // Função para selecionar policial
  const handleSelectPolicial = (policial: Policial) => {
    setFormData({
      ...formData,
      policial: policial.nome,
      rg: policial.rg,
      graduacao: policial.graduacao || policial.patente,
    })
    setValue(policial.nome)
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#ffbf00]">Gestão de Advertências</h1>
      
      {successMessage && (
        <AlertSuccess message={successMessage} onClose={() => setSuccessMessage("")} />
      )}
      
      {errorMessage && (
        <AlertError message={errorMessage} onClose={() => setErrorMessage("")} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar advertência..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtroStatus} onValueChange={(value) => setFiltroStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Ativa">Ativas</SelectItem>
                  <SelectItem value="Cumprida">Cumpridas</SelectItem>
                  <SelectItem value="Anulada">Anuladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data</Label>
              <DatePicker 
                value={filtroData} 
                onChange={setFiltroData} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selecione">Selecione uma opção</SelectItem>
                  <SelectItem value="data-desc">Data (mais recente)</SelectItem>
                  <SelectItem value="data-asc">Data (mais antiga)</SelectItem>
                  <SelectItem value="policial-asc">Nome do Policial (A-Z)</SelectItem>
                  <SelectItem value="policial-desc">Nome do Policial (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <XIcon className="h-4 w-4" /> Limpar Filtros
              </Button>
              
              <Button
                onClick={handleAddAdvertencia}
                className="flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" /> Nova Advertência
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#ffbf00]">Advertências</CardTitle>
            <CardDescription>
              {filteredAdvertencias.length} registro(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAdvertencias.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Nenhuma advertência encontrada com os filtros selecionados.
                </p>
              ) : (
                filteredAdvertencias.map((advertencia) => (
                  <Card key={advertencia.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{advertencia.policial}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(advertencia.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <Badge className={getStatusColor(advertencia.status)}>{advertencia.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm">{advertencia.motivo}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Aplicada por: {advertencia.aplicadaPor}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end p-2 bg-muted/20">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewAdvertencia(advertencia)}
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAdvertencia(advertencia)}
                        >
                          <FileEditIcon className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => handleDeleteAdvertencia(advertencia)}
                        >
                          <Trash2Icon className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de Adicionar */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Advertência</DialogTitle>
            <DialogDescription>
              Preencha os campos para adicionar uma nova advertência.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="policial">Nome do Policial *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? policiais.find((policial) => policial.nome === value)?.nome
                      : "Selecione um policial..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Buscar policial..." 
                      value={value}
                      onValueChange={setValue}
                    />
                    <CommandEmpty>Nenhum policial encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                      {policiais.map((policial) => (
                        <CommandItem
                          key={policial.id}
                          value={policial.nome}
                          onSelect={() => handleSelectPolicial(policial)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === policial.nome ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{policial.nome}</span>
                            <span className="text-sm text-muted-foreground">
                              {policial.patente} - {policial.matricula}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="graduacao">Graduação *</Label>
                <Input
                  id="graduacao"
                  name="graduacao"
                  value={formData.graduacao}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo da Advertência *</Label>
              <Textarea
                id="motivo"
                name="motivo"
                rows={3}
                value={formData.motivo}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Data</Label>
              <DatePicker 
                value={formData.data} 
                onChange={handleDateChange} 
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "Ativa" | "Cumprida" | "Anulada") => 
                  handleSelectChange(value, "status")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selecione">Selecione o status</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Cumprida">Cumprida</SelectItem>
                  <SelectItem value="Anulada">Anulada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAdvertencia} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Advertência</DialogTitle>
            <DialogDescription>
              Modifique os campos para atualizar a advertência.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="policial">Nome do Policial *</Label>
              <Input
                id="policial"
                name="policial"
                value={formData.policial}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo da Advertência *</Label>
              <Textarea
                id="motivo"
                name="motivo"
                rows={3}
                value={formData.motivo}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Data</Label>
              <DatePicker 
                value={formData.data} 
                onChange={handleDateChange} 
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "Ativa" | "Cumprida" | "Anulada") => 
                  handleSelectChange(value, "status")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selecione">Selecione o status</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Cumprida">Cumprida</SelectItem>
                  <SelectItem value="Anulada">Anulada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAdvertencia} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Visualização */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Advertência</DialogTitle>
          </DialogHeader>
          {selectedAdvertencia && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{selectedAdvertencia.policial}</h3>
                <Badge className={getStatusColor(selectedAdvertencia.status)}>
                  {selectedAdvertencia.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data:</span>
                  <span>{format(selectedAdvertencia.data, "dd/MM/yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aplicada por:</span>
                  <span>{selectedAdvertencia.aplicadaPor}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Motivo da Advertência</h4>
                <p className="text-sm border rounded-md p-3 bg-muted/20">
                  {selectedAdvertencia.motivo}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Exclusão */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta advertência? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteAdvertencia}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 