"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import type { User, AdminSettings as AdminSettingsType } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminSettingsProps {
  currentAdmin: User
  settings: AdminSettingsType
  onSettingsChange: (settings: AdminSettingsType) => void
}

export function AdminSettings({ currentAdmin, settings, onSettingsChange }: AdminSettingsProps) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSettingChange = (key: keyof AdminSettingsType, value: boolean) => {
    // Verificar se o usuário atual tem permissão para gerenciar usuários
    if (!currentAdmin.permissions.includes("gerenciar_usuarios")) {
      setError("Você não tem permissão para alterar configurações do sistema.")
      return
    }

    const updatedSettings = {
      ...settings,
      [key]: value,
    }

    onSettingsChange(updatedSettings)

    setSuccess("Configurações atualizadas com sucesso.")

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-800 border-green-600">
          <AlertDescription className="text-white">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Usuários</CardTitle>
          <CardDescription>Gerencie as configurações relacionadas aos usuários administrativos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="registration-enabled">Permitir Cadastro de Novos Usuários</Label>
              <p className="text-sm text-muted-foreground">
                Quando ativado, novos usuários administrativos podem ser cadastrados.
              </p>
            </div>
            <Switch
              id="registration-enabled"
              checked={settings.registrationEnabled}
              onCheckedChange={(value) => handleSettingChange("registrationEnabled", value)}
              disabled={!currentAdmin.permissions.includes("gerenciar_usuarios")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Exigir Aprovação para Novos Usuários</Label>
              <p className="text-sm text-muted-foreground">
                Quando ativado, novos usuários precisam ser aprovados por um administrador.
              </p>
            </div>
            <Switch
              id="require-approval"
              checked={settings.requireApproval}
              onCheckedChange={(value) => handleSettingChange("requireApproval", value)}
              disabled={!currentAdmin.permissions.includes("gerenciar_usuarios")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
          <CardDescription>Informações sobre o sistema administrativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Versão do Sistema</p>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          <div>
            <p className="text-sm font-medium">Desenvolvido por</p>
            <p className="text-sm text-muted-foreground">Batalhão Tático Especial - GTA Roleplay</p>
          </div>
          <div>
            <p className="text-sm font-medium">Última Atualização</p>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
