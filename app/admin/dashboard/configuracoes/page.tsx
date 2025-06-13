"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, AdminSettings } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Configurações padrão
const defaultSettings: AdminSettings = {
  registrationEnabled: true,
  requireApproval: false,
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null)
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Configurações de aparência
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: true,
    highContrast: false,
    animationsEnabled: true,
    fontSize: "medium",
  })

  // Configurações de notificações
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    systemNotifications: true,
    soundEnabled: false,
  })

  useEffect(() => {
    // Carregar informações do administrador atual
    const admin = localStorage.getItem("currentAdmin")
    if (admin) {
      setCurrentAdmin(JSON.parse(admin))
    } else {
      router.push("/admin/login?redirectTo=/admin/dashboard/configuracoes")
      return
    }

    // Carregar configurações do localStorage ou usar padrão
    const storedSettings = localStorage.getItem("adminSettings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    } else {
      setSettings(defaultSettings)
      localStorage.setItem("adminSettings", JSON.stringify(defaultSettings))
    }

    // Carregar configurações de aparência
    const storedAppearanceSettings = localStorage.getItem("appearanceSettings")
    if (storedAppearanceSettings) {
      setAppearanceSettings(JSON.parse(storedAppearanceSettings))
    }

    // Carregar configurações de notificações
    const storedNotificationSettings = localStorage.getItem("notificationSettings")
    if (storedNotificationSettings) {
      setNotificationSettings(JSON.parse(storedNotificationSettings))
    }

    setIsLoading(false)
  }, [router])

  // Aplicar configurações de aparência quando a página carrega ou quando as configurações mudam
  useEffect(() => {
    if (isLoading) return; // Esperar que tudo carregue primeiro
    
    const html = document.documentElement;
    
    // Aplicar modo escuro/claro
    if (appearanceSettings.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Aplicar alto contraste
    if (appearanceSettings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    // Aplicar tamanho da fonte
    html.style.fontSize = appearanceSettings.fontSize === 'small' 
      ? '14px' 
      : appearanceSettings.fontSize === 'large' 
        ? '18px' 
        : '16px';
        
    // Aplicar configuração de animações
    if (!appearanceSettings.animationsEnabled) {
      html.classList.add('no-animations');
    } else {
      html.classList.remove('no-animations');
    }
  }, [appearanceSettings, isLoading]);

  // Função para atualizar as configurações administrativas
  const handleSettingsChange = (newSettings: AdminSettings) => {
    try {
      setSettings(newSettings)
      localStorage.setItem("adminSettings", JSON.stringify(newSettings))
      setSuccess("Configurações administrativas atualizadas com sucesso.")

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao salvar as configurações. Tente novamente.")
    }
  }

  // Função para atualizar as configurações de aparência
  const handleAppearanceChange = (key: string, value: any) => {
    try {
      const newSettings = { ...appearanceSettings, [key]: value }
      setAppearanceSettings(newSettings)
      localStorage.setItem("appearanceSettings", JSON.stringify(newSettings))
      setSuccess("Configurações de aparência atualizadas com sucesso.")

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao salvar as configurações. Tente novamente.")
    }
  }

  // Função para salvar todas as configurações de aparência de uma vez
  const saveAppearanceSettings = () => {
    try {
      localStorage.setItem("appearanceSettings", JSON.stringify(appearanceSettings))
      
      // Aplicar configurações ao tema
      const html = document.documentElement;
      
      // Aplicar modo escuro/claro
      if (appearanceSettings.darkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      // Aplicar alto contraste
      if (appearanceSettings.highContrast) {
        html.classList.add('high-contrast');
      } else {
        html.classList.remove('high-contrast');
      }
      
      // Aplicar tamanho da fonte
      html.style.fontSize = appearanceSettings.fontSize === 'small' 
        ? '14px' 
        : appearanceSettings.fontSize === 'large' 
          ? '18px' 
          : '16px';
          
      // Aplicar configuração de animações
      if (!appearanceSettings.animationsEnabled) {
        html.classList.add('no-animations');
      } else {
        html.classList.remove('no-animations');
      }
      
      setSuccess("Configurações de aparência aplicadas com sucesso.")

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao aplicar as configurações. Tente novamente.")
    }
  }

  // Função para atualizar as configurações de notificações
  const handleNotificationChange = (key: string, value: any) => {
    try {
      const newSettings = { ...notificationSettings, [key]: value }
      setNotificationSettings(newSettings)
      localStorage.setItem("notificationSettings", JSON.stringify(newSettings))
      setSuccess("Configurações de notificações atualizadas com sucesso.")

      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Ocorreu um erro ao salvar as configurações. Tente novamente.")
    }
  }

  if (isLoading || !currentAdmin) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-rota-gold">Configurações</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Gerencie as configurações gerais do sistema administrativo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registration-enabled" className="text-base">
                    Registro de Usuários
                  </Label>
                  <p className="text-sm text-muted-foreground">Permitir que novos usuários se registrem no sistema</p>
                </div>
                <Switch
                  id="registration-enabled"
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => handleSettingsChange({ ...settings, registrationEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-approval" className="text-base">
                    Aprovação de Contas
                  </Label>
                  <p className="text-sm text-muted-foreground">Exigir aprovação administrativa para novas contas</p>
                </div>
                <Switch
                  id="require-approval"
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) => handleSettingsChange({ ...settings, requireApproval: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSettingsChange(settings)}
                className="bg-rota-gold hover:bg-rota-darkgold text-black"
              >
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>Personalize a aparência do painel administrativo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-rota-gray/30 p-4 rounded-md mb-4 text-sm text-rota-darkgold">
                <p><strong>Como funcionam as configurações de aparência:</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Modo Escuro:</strong> Ativa o tema escuro em todo o painel.</li>
                  <li><strong>Alto Contraste:</strong> Aumenta o contraste de cores para melhor acessibilidade.</li>
                  <li><strong>Animações:</strong> Controla efeitos de transição e animações na interface.</li>
                  <li><strong>Tamanho da Fonte:</strong> Ajusta o tamanho do texto em todo o painel.</li>
                </ul>
                <p className="mt-2">Clique em "Salvar Aparência" para aplicar todas as alterações.</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-base">
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-muted-foreground">Ativar tema escuro para o painel administrativo</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={appearanceSettings.darkMode}
                  onCheckedChange={(checked) => handleAppearanceChange("darkMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="text-base">
                    Alto Contraste
                  </Label>
                  <p className="text-sm text-muted-foreground">Aumentar o contraste para melhor acessibilidade</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={appearanceSettings.highContrast}
                  onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations" className="text-base">
                    Animações
                  </Label>
                  <p className="text-sm text-muted-foreground">Ativar animações na interface</p>
                </div>
                <Switch
                  id="animations"
                  checked={appearanceSettings.animationsEnabled}
                  onCheckedChange={(checked) => handleAppearanceChange("animationsEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="font-size" className="text-base">
                    Tamanho da Fonte
                  </Label>
                  <p className="text-sm text-muted-foreground">Ajustar o tamanho da fonte na interface</p>
                </div>
                <Select
                  value={appearanceSettings.fontSize}
                  onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeno</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={saveAppearanceSettings}
                className="bg-rota-gold hover:bg-rota-darkgold text-black"
              >
                Salvar Aparência
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Gerencie como você recebe notificações do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">
                    Notificações por Email
                  </Label>
                  <p className="text-sm text-muted-foreground">Receber notificações importantes por email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-notifications" className="text-base">
                    Notificações do Sistema
                  </Label>
                  <p className="text-sm text-muted-foreground">Mostrar notificações no painel administrativo</p>
                </div>
                <Switch
                  id="system-notifications"
                  checked={notificationSettings.systemNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("systemNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-enabled" className="text-base">
                    Sons de Notificação
                  </Label>
                  <p className="text-sm text-muted-foreground">Ativar sons para notificações importantes</p>
                </div>
                <Switch
                  id="sound-enabled"
                  checked={notificationSettings.soundEnabled}
                  onCheckedChange={(checked) => handleNotificationChange("soundEnabled", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleNotificationChange("soundEnabled", notificationSettings.soundEnabled)}
                className="bg-rota-gold hover:bg-rota-darkgold text-black"
              >
                Salvar Notificações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
