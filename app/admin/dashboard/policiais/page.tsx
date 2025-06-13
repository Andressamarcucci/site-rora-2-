"use client";

import { useState, useEffect, useMemo } from "react";
import Cropper from "react-easy-crop";
import { User, Permissao, Advertencia } from "../../../../lib/types";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader, DialogTitle
} from "../../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { Shield, Pencil, Trash2, Plus } from "lucide-react";
import { getCroppedImg } from "./utils";


interface Policial {
  id: string
  nome: string
  rg: string
  graduacao: string
  unidade: string
  funcao: string
 status: "ativo" | "inativo"
  observacoes: string
  dataIngresso: string
  avatar: string
  ultimaAtualizacao: string
  advertencias: Advertencia[]
  permissoes: Permissao[]
}


interface FormValues {
  nome: string
  rg: string
  graduacao: string
  unidade: string
  funcao: string
  status: "ativo" | "inativo"
  observacoes: string
  dataIngresso: string
  avatar: string
  ultimaAtualizacao: string
  advertencias: Advertencia[]
  permissoes: Permissao[]
}

export default function AdminPoliciaisPage() {
  // Estados
  const [] = useState<User | null>(null)
  const [policiais, setPoliciais] = useState<Policial[]>([])
  const [, setIsLoading] = useState(true)
  const [, setError] = useState<string>("")
  const [, setSuccess] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [unidadeFilter, setUnidadeFilter] = useState<string>("todas")
  const [sortField, setSortField] = useState<keyof Policial>("nome")
  const [sortDirection] = useState<"asc" | "desc">("asc")
  const [permissoes, setPermissoes] = useState<Permissao[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
 
  const [isPermissoesDialogOpen, setIsPermissoesDialogOpen] = useState(false)
  const [currentPolicial, setCurrentPolicial] = useState<Policial | null>(null)
  const [formData, setFormData] = useState<FormValues>({
    nome: "",
    rg: "",
    graduacao: "",
    unidade: "",
    funcao: "",
    status: "ativo",
    observacoes: "",
    dataIngresso: "",
    avatar: "",
    ultimaAtualizacao: "",
    advertencias: [],
    permissoes: []
  })
  const [graduacoes, setGraduacoes] = useState<string[]>([])
  const [unidades, setUnidades] = useState<string[]>([])
  const [imageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isCropOpen, setIsCropOpen] = useState(false)

  // Efeitos
  useEffect(() => {
    // Carregar dados iniciais
    const storedPoliciais = localStorage.getItem('policiais')
    if (storedPoliciais) {
      setPoliciais(JSON.parse(storedPoliciais))
    }

    const storedGraduacoes = localStorage.getItem('graduacoes')
    const storedUnidades = localStorage.getItem('unidades')
    if (storedGraduacoes) setGraduacoes(JSON.parse(storedGraduacoes))
    if (storedUnidades) setUnidades(JSON.parse(storedUnidades))

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Carregar permissões
    const storedPermissoes = localStorage.getItem('permissoes')
    if (storedPermissoes) {
      setPermissoes(JSON.parse(storedPermissoes))
    }
  }, [])

  useEffect(() => {
    // Atualizar lista de policiais quando uma advertência é aplicada
    const storedAdvertencias = localStorage.getItem('advertencias')
    if (storedAdvertencias) {
      const parsedAdvertencias = JSON.parse(storedAdvertencias) as Advertencia[]
      const updatedPoliciais = policiais.map((policia) => {
        const advertenciasPolicia = parsedAdvertencias.filter((adv) => adv.policialId === policia.id)
        return {
          ...policia,
          advertencias: advertenciasPolicia
        }
      })
      setPoliciais(updatedPoliciais)
    }
  }, [policiais])

  // Memoized values
  const filteredPoliciais = useMemo(() => {
    let filtered = policiais

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((p: Policial) =>
        p.nome.toLowerCase().includes(term) ||
        p.rg.toLowerCase().includes(term) ||
        p.graduacao.toLowerCase().includes(term) ||
        p.unidade.toLowerCase().includes(term)
      )
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter((p: Policial) => p.status === statusFilter)
    }

    if (unidadeFilter !== "todas") {
      filtered = filtered.filter((p: Policial) => p.unidade === unidadeFilter)
    }

    return filtered.sort((a: Policial, b: Policial) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [policiais, searchTerm, statusFilter, unidadeFilter, sortField, sortDirection])



  // Funções

  const handleAdicionar = () => {
    setCurrentPolicial(null)
    setFormData({
      nome: "",
      rg: "",
      graduacao: "",
      unidade: "",
      funcao: "",
      status: "ativo",
      observacoes: "",
      dataIngresso: "",
      avatar: "",
      ultimaAtualizacao: "",
      advertencias: [],
      permissoes: []
    })
    setIsDialogOpen(true)
  }

  const handleEditar = (policial: Policial) => {
    setCurrentPolicial(policial)
    setFormData({
      nome: policial.nome,
      rg: policial.rg,
      graduacao: policial.graduacao,
      unidade: policial.unidade,
      funcao: policial.funcao,
      status: policial.status,
      observacoes: policial.observacoes,
      dataIngresso: policial.dataIngresso,
      avatar: policial.avatar,
      ultimaAtualizacao: policial.ultimaAtualizacao,
      advertencias: policial.advertencias,
      permissoes: policial.permissoes
    })
    setIsDialogOpen(true)
  }

  const handleDeletePolicial = (policial: Policial) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o policial ${policial.nome}?`)
    if (confirmDelete) {
      const updatedPoliciais = policiais.filter((p: Policial) => p.id !== policial.id)
      setPoliciais(updatedPoliciais)
      localStorage.setItem('policiais', JSON.stringify(updatedPoliciais))
      setSuccess(`Policial ${policial.nome} excluído com sucesso!`)
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }
  }






  const handleSavePolicial = async () => {
    try {
      const policial: Policial = {
        id: currentPolicial?.id || crypto.randomUUID(),
        nome: formData.nome,
        rg: formData.rg,
        graduacao: formData.graduacao,
        unidade: formData.unidade,
        funcao: formData.funcao,
        status: formData.status,
        observacoes: formData.observacoes,
        dataIngresso: formData.dataIngresso,
        avatar: formData.avatar,
        ultimaAtualizacao: new Date().toISOString(),
        advertencias: formData.advertencias || [],
        permissoes: formData.permissoes || []
      }

      if (currentPolicial) {
        const updatedPoliciais = policiais.map((p: Policial) =>
          p.id === currentPolicial.id ? policial : p
        )
        setPoliciais(updatedPoliciais)
        localStorage.setItem('policiais', JSON.stringify(updatedPoliciais))
        setSuccess("Policial atualizado com sucesso!")
      } else {
        setPoliciais([...policiais, policial])
        localStorage.setItem('policiais', JSON.stringify([...policiais, policial]))
        setSuccess("Policial adicionado com sucesso!")
      }

      setIsDialogOpen(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError("Erro ao salvar policial. Tente novamente.")
    }
  }


  const handleCropComplete = async (croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    try {
      if (!imageSrc) {
        return
      }

      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (croppedImage) {
        setFormData((prev) => ({
          ...prev,
          avatar: croppedImage
        }))
        setIsCropOpen(false)
      }
    } catch (error) {
      console.error('Erro ao cortar imagem:', error)
      setError('Erro ao processar a imagem. Tente novamente.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header e filtros */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administração de Policiais</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAdicionar}>
            <Plus className="mr-2 h-4 w-4" /> Novo Policial
          </Button>
          <Button variant="outline" onClick={() => setIsPermissoesDialogOpen(true)}>
            <Shield className="mr-2 h-4 w-4" /> Permissões
          </Button>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="unidade">Unidade</Label>
          <Select
            value={unidadeFilter}
            onValueChange={(value) => setUnidadeFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {unidades.map((unidade) => (
                <SelectItem key={unidade} value={unidade}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="sort">Ordenar por</Label>
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as keyof Policial)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o campo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="rg">RG</SelectItem>
              <SelectItem value="unidade">Unidade</SelectItem>
              <SelectItem value="graduacao">Graduação</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de policiais */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>RG</TableHead>
              <TableHead>Graduação</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPoliciais.map((policial: Policial) => (
              <TableRow key={policial.id}>
                <TableCell className="font-medium">{policial.nome}</TableCell>
                <TableCell>{policial.rg}</TableCell>
                <TableCell>{policial.graduacao}</TableCell>
                <TableCell>{policial.unidade}</TableCell>
                <TableCell>{policial.funcao}</TableCell>
                <TableCell>
                  <Badge variant={policial.status === "ativo" ? "default" : "destructive"}>
                    {policial.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditar(policial)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePolicial(policial)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Notificações de advertências */}
      {/* renderAdvertenciaNotifications() - Removido pois a função não está definida */}

      {/* Modal de Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentPolicial ? "Editar Policial" : "Novo Policial"}
            </DialogTitle>
            <DialogDescription>
              {currentPolicial ? "Edite as informações do policial" : "Adicione um novo policial"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  placeholder="RG"
                  value={formData.rg}
                  onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduacao">Graduação *</Label>
                <Select
                  value={formData.graduacao}
                  onValueChange={(value: string) => setFormData({ ...formData, graduacao: value })} // Added string type
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a graduação" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduacoes.map((graduacao) => (
                      <SelectItem key={graduacao} value={graduacao}>
                        {graduacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade *</Label>
                <Select
                  value={formData.unidade}
                  onValueChange={(value: string) => setFormData({ ...formData, unidade: value })} // Added string type
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidade) => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="funcao">Função *</Label>
                <Input
                  id="funcao"
                  placeholder="Função"
                  value={formData.funcao}
                  onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ativo" | "inativo") => setFormData({ ...formData, status: value })} // Added specific type
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataIngresso">Data de Ingresso *</Label>
              <Input
                id="dataIngresso"
                type="date"
                value={formData.dataIngresso}
                onChange={(e) => setFormData({ ...formData, dataIngresso: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={formData.avatar} alt="Avatar do policial" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  onClick={() => setIsCropOpen(true)}
                >
                  Selecionar imagem
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertencias">Advertências</Label>
              <div className="space-y-2">
                {formData.advertencias.map((advertencia, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge
                      variant={
                        advertencia.status === "pendente"
                          ? "secondary"
                          : advertencia.status === "aprovada"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {advertencia.status}
                    </Badge>
                    <span>{advertencia.descricao}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="default" onClick={handleSavePolicial}>
              {currentPolicial ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Permissões */}
      <Dialog open={isPermissoesDialogOpen} onOpenChange={setIsPermissoesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Permissões</DialogTitle>
            <DialogDescription>
              Gerencie as permissões dos policiais
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Permissões</Label>
              <div className="space-y-2">
                {permissoes.map((permissao: Permissao) => ( // Added Permissao type
                  <div key={permissao.id} className="flex items-center gap-2">
                    <Checkbox
                      id={permissao.id}
 checked={currentPolicial?.permissoes.some((p: Permissao) => p.id === permissao.id) as boolean | "indeterminate"} // Added Permissao type
                      onCheckedChange={(checked: boolean) => { // Added boolean type
                        if (checked) {
                          setCurrentPolicial((prev: Policial | null) => prev ? ({ // Added type
                            ...prev,
                            permissoes: [...(prev?.permissoes || []), permissao]
                          }) : null)
                        } else {
                          setCurrentPolicial((prev: Policial | null) => prev ? ({ // Added type
                            ...prev,
                            permissoes: (prev?.permissoes || []).filter((p: Permissao) => p.id !== permissao.id) // Added type
                          }) : null)
                        }
                      }}
                    />
                    <Label htmlFor={permissao.id}>{permissao.nome}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPermissoesDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Crop */}
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cortar Imagem</DialogTitle>
            <DialogDescription>
              Selecione a área da imagem que deseja usar como avatar
            </DialogDescription>
          </DialogHeader>
          <div className="h-64">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                onCropComplete={(_croppedArea: any, croppedAreaPixels: any) => handleCropComplete(croppedAreaPixels)} // Added any types for simplicity
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleCropComplete(crop as any)}>Confirmar</Button> {/* Kept any for now, consider defining Area interface */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
