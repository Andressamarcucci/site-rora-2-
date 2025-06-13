"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Configuração para desabilitar cache da página - usando valores estáticos em vez de função
export const dynamic = 'force-dynamic';

interface AdminProfile {
  id: string
  name: string
  email: string
  rg: string
  patente: string
  unidade: string
  departamento: string
  cargo: string
  telefone: string
  dataIngresso: string
  bio: string
  avatarUrl: string | null
  permissoes: string[]
}

export default function PerfilAdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Carregar dados do perfil (simulado)
  useEffect(() => {
    setIsLoading(true)

    // Simulando carregamento de dados do administrador
    setTimeout(() => {
      const storedAdmin = localStorage.getItem("admin")

      // Dados simulados para o perfil de administrador
      const mockProfile: AdminProfile = {
        id: "1",
        name: storedAdmin ? JSON.parse(storedAdmin).name : "Major Rodrigo Soares",
        email: storedAdmin ? JSON.parse(storedAdmin).email : "major.soares@rota.com",
        rg: "987654",
        patente: storedAdmin ? JSON.parse(storedAdmin).rank || "MAJOR PM" : "MAJOR PM",
        unidade: "Comando Central",
        departamento: "Operações Táticas",
        cargo: "Oficial de Comando",
        telefone: "(11) 97654-3210",
        dataIngresso: "2018-01-10",
        bio: "Oficial de comando com 10 anos de experiência em operações táticas especiais e gestão de pessoal.",
        avatarUrl: storedAdmin && JSON.parse(storedAdmin).avatarUrl ? JSON.parse(storedAdmin).avatarUrl : null,
        permissoes: ["gerenciar_usuarios", "aprovar_operacoes", "editar_conteudo"]
      }

      setProfile(mockProfile)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Função para atualizar os campos do perfil
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  // Função para atualizar campos de select
  const handleSelectChange = (value: string, field: string) => {
    if (!profile) return

    setProfile({
      ...profile,
      [field]: value,
    })
  }

  // Função para abrir o seletor de arquivo
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // Função para processar o arquivo selecionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      })
      return
    }

    // Verificar tamanho do arquivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Função para salvar as alterações
  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)

    try {
      // Simulando upload de imagem e salvamento de dados
      // Em uma aplicação real, aqui você enviaria a imagem para um servidor
      
      // Criar uma cópia atualizada do perfil
      const updatedProfile = {
        ...profile
      };
      
      // Adicionar URL da imagem se houver uma imagem selecionada
      if (previewImage) {
        updatedProfile.avatarUrl = previewImage;
      }
      
      // Atualizar o estado do perfil com todos os dados atualizados
      setProfile(updatedProfile);
      
      // Salvar no localStorage para simular persistência
      const admin = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")!) : {};
      
      // Salva todos os dados do administrador incluindo a foto
      localStorage.setItem(
        "admin",
        JSON.stringify({
          ...admin,
          name: updatedProfile.name,
          email: updatedProfile.email,
          rg: updatedProfile.rg,
          rank: updatedProfile.patente,
          unidade: updatedProfile.unidade,
          departamento: updatedProfile.departamento,
          cargo: updatedProfile.cargo,
          telefone: updatedProfile.telefone,
          dataIngresso: updatedProfile.dataIngresso,
          bio: updatedProfile.bio,
          avatarUrl: updatedProfile.avatarUrl,
          permissoes: updatedProfile.permissoes
        })
      );
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações e foto de perfil foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rota-gold" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Erro ao carregar perfil</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Meu Perfil de Comando</h2>
        <p className="text-muted-foreground">Visualize e edite suas informações como administrador</p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Foto de Perfil</CardTitle>
              <CardDescription>Clique na imagem para alterar sua foto</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
                <Avatar className="h-32 w-32 border-2 border-[#ffbf00]">
                  <AvatarImage src={previewImage || profile.avatarUrl || undefined} />
                  <AvatarFallback className="bg-rota-darkgold text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground mt-2">Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB</p>
            </CardContent>
          </Card>

          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="name" value={profile.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" name="rg" value={profile.rg} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" value={profile.telefone} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Informações de Comando</CardTitle>
              <CardDescription>Dados relacionados à sua função no comando</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patente">Patente</Label>
                  <Select value={profile.patente} onValueChange={(value) => handleSelectChange(value, "patente")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma patente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAJOR PM">MAJOR PM</SelectItem>
                      <SelectItem value="TENENTE CORONEL PM">TENENTE CORONEL PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={profile.unidade} onValueChange={(value) => handleSelectChange(value, "unidade")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Comando Central">Comando Central</SelectItem>
                      <SelectItem value="Batalhão de Comando">Batalhão de Comando</SelectItem>
                      <SelectItem value="Força Tática Central">Força Tática Central</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={profile.departamento} onValueChange={(value) => handleSelectChange(value, "departamento")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operações Táticas">Operações Táticas</SelectItem>
                      <SelectItem value="Inteligência">Inteligência</SelectItem>
                      <SelectItem value="Logística">Logística</SelectItem>
                      <SelectItem value="Treinamento">Treinamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" name="cargo" value={profile.cargo} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataIngresso">Data de Ingresso</Label>
                  <Input
                    id="dataIngresso"
                    name="dataIngresso"
                    type="date"
                    value={profile.dataIngresso}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Descreva sua experiência e especialidades..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#ffbf00] text-black hover:bg-amber-500"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Segurança da Conta</CardTitle>
              <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button className="bg-[#ffbf00] text-black hover:bg-amber-500">Atualizar Senha</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 