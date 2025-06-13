"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
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
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface UserProfile {
  id: string
  name: string
  email: string
  rg: string
  patente: string
  unidade: string
  funcao: string
  telefone: string
  dataIngresso: string
  bio: string
  avatarUrl: string | null
}

export default function PerfilPage() {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [advertencias, setAdvertencias] = useState<any[]>([])
  const [showAdvertenciaDialog, setShowAdvertenciaDialog] = useState(false)
  const [advertenciaAtiva, setAdvertenciaAtiva] = useState<any | null>(null)

  // Carregar dados do perfil (simulado)
  useEffect(() => {
    setIsLoading(true)

    // Simulando carregamento de dados do usuário
    setTimeout(() => {
      const storedUser = localStorage.getItem("user")

      // Dados simulados para o perfil
      const mockProfile: UserProfile = {
        id: "1",
        name: storedUser ? JSON.parse(storedUser).name : "Carlos Silva",
        email: storedUser ? JSON.parse(storedUser).email : "carlos.silva@rota.com",
        rg: "123456",
        patente: "Tenente",
        unidade: "Batalhão Central",
        funcao: "Comandante de Pelotão",
        telefone: "(11) 98765-4321",
        dataIngresso: "2022-03-15",
        bio: "Oficial com 5 anos de experiência em operações táticas especiais.",
        avatarUrl: null,
      }

      setProfile(mockProfile)
      setPreviewImage(mockProfile.avatarUrl)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Carregar advertências do localStorage
    const storedAdvertencias = localStorage.getItem("advertencias")
    if (storedAdvertencias && profile) {
      const todas = JSON.parse(storedAdvertencias)
      // Buscar por nome, RG ou matrícula
      const advs = todas.filter((a: any) =>
        a.policial === profile.name ||
        a.rg === profile.rg ||
        a.matricula === profile.rg // Supondo que matrícula pode ser o RG
      )
      setAdvertencias(advs)
      // Se houver advertência ativa, mostrar popup
      const ativa = advs.find((a: any) => a.status === "Ativa")
      if (ativa) {
        setAdvertenciaAtiva(ativa)
        setShowAdvertenciaDialog(true)
      }
    }
  }, [profile])

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

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  async function getCroppedImg(imageSrc: string, crop: any) {
    const createImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const diameter = Math.min(crop.width, crop.height)
    canvas.width = diameter
    canvas.height = diameter
    ctx.beginPath()
    ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      diameter,
      diameter,
      0,
      0,
      diameter,
      diameter
    )
    return canvas.toDataURL('image/jpeg')
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
        ...profile,
        avatarUrl: previewImage || profile.avatarUrl || null,
      };
      
      // Atualizar o estado do perfil com todos os dados atualizados
      setProfile(updatedProfile);
      
      // Salvar no localStorage para simular persistência
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : {};
      
      // Salva todos os dados do usuário incluindo a foto
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: updatedProfile.name,
          email: updatedProfile.email,
          rg: updatedProfile.rg,
          patente: updatedProfile.patente,
          unidade: updatedProfile.unidade,
          funcao: updatedProfile.funcao,
          telefone: updatedProfile.telefone,
          dataIngresso: updatedProfile.dataIngresso,
          bio: updatedProfile.bio,
          avatarUrl: updatedProfile.avatarUrl,
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
    <div className="w-full h-full min-h-screen flex flex-col space-y-6 p-0 md:p-6">
      {/* Popup de advertência ativa */}
      {advertenciaAtiva && (
        <Dialog open={showAdvertenciaDialog} onOpenChange={setShowAdvertenciaDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Advertência Ativa</DialogTitle>
              <DialogDescription>
                Você recebeu uma advertência!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p><b>Motivo:</b> {advertenciaAtiva.motivo}</p>
              <p><b>Data:</b> {advertenciaAtiva.data ? new Date(advertenciaAtiva.data).toLocaleDateString() : "-"}</p>
              <p><b>Aplicada por:</b> {advertenciaAtiva.aplicadaPor}</p>
            </div>
            <Button onClick={() => setShowAdvertenciaDialog(false)} className="mt-4">Fechar</Button>
          </DialogContent>
        </Dialog>
      )}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Meu Perfil</h2>
        <p className="text-rota-darkgold">Visualize e edite suas informações pessoais</p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="advertencias">Advertências</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>Clique na imagem para alterar sua foto</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center min-h-[220px] md:min-h-[260px] justify-center">
              <div className="relative cursor-pointer group" onClick={handleAvatarClick} style={{ width: 128, height: 128 }}>
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-2 border-rota-gold">
                  <AvatarImage src={previewImage || profile.avatarUrl || undefined} />
                  <AvatarFallback className="bg-rota-darkgold text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <Input
                ref={fileInputRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageSrc(reader.result as string)
                      setIsCropOpen(true)
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-2">Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB</p>
            </CardContent>
          </Card>

          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
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
              <CardTitle>Informações Profissionais</CardTitle>
              <CardDescription>Dados relacionados à sua função no batalhão</CardDescription>
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
                      <SelectItem value="Soldado">Soldado</SelectItem>
                      <SelectItem value="Cabo">Cabo</SelectItem>
                      <SelectItem value="Sargento">Sargento</SelectItem>
                      <SelectItem value="Tenente">Tenente</SelectItem>
                      <SelectItem value="Capitão">Capitão</SelectItem>
                      <SelectItem value="Major">Major</SelectItem>
                      <SelectItem value="Coronel">Coronel</SelectItem>
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
                      <SelectItem value="Batalhão Central">Batalhão Central</SelectItem>
                      <SelectItem value="Unidade Tática">Unidade Tática</SelectItem>
                      <SelectItem value="Força Especial">Força Especial</SelectItem>
                      <SelectItem value="Patrulha Urbana">Patrulha Urbana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input id="funcao" name="funcao" value={profile.funcao} onChange={handleChange} />
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
                className="bg-rota-gold text-black hover:bg-rota-lightgold"
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
              <CardTitle>Segurança da Conta</CardTitle>
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
              <Button>Atualizar Senha</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advertencias" className="space-y-4 mt-4">
          <Card className="border-rota-darkgold/20">
            <CardHeader>
              <CardTitle>Advertências Recebidas</CardTitle>
              <CardDescription>Veja todas as advertências registradas em seu nome</CardDescription>
            </CardHeader>
            <CardContent>
              {advertencias.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma advertência registrada.</p>
              ) : (
                <ul className="space-y-2">
                  {advertencias.map((a, idx) => (
                    <li key={a.id || idx} className="border-b border-rota-darkgold/10 pb-2 mb-2">
                      <div><b>Status:</b> {a.status}</div>
                      <div><b>Motivo:</b> {a.motivo}</div>
                      <div><b>Data:</b> {a.data ? new Date(a.data).toLocaleDateString() : "-"}</div>
                      <div><b>Aplicada por:</b> {a.aplicadaPor}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Recortar Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCropOpen(false)} className="border-rota-darkgold text-rota-gold">Cancelar</Button>
            <Button
              onClick={async () => {
                if (imageSrc && croppedAreaPixels) {
                  const cropped = await getCroppedImg(imageSrc, croppedAreaPixels)
                  setPreviewImage(cropped || "")
                  setIsCropOpen(false)
                  // Atualizar profile e localStorage imediatamente
                  if (cropped && profile) {
                    const updatedProfile = { ...profile, avatarUrl: cropped }
                    setProfile(updatedProfile)
                    setPreviewImage(cropped)
                    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : {}
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        ...user,
                        avatarUrl: cropped,
                      })
                    )
                  }
                }
              }}
              className="bg-rota-gold text-black hover:bg-amber-500"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
