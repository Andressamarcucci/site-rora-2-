"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react"
import { loginUser } from "@/lib/auth-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetPassword, setResetPassword] = useState("")
  const [resetConfirm, setResetConfirm] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState("")

  // Obter mensagem de erro da URL, se existir
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setError(message)
    }
  }, [searchParams])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await loginUser(email, password, rememberMe)
      if (result === true) {
        // Verificar se existe um redirectTo na URL
        const redirectTo = searchParams.get('redirectTo') || '/dashboard'
        console.log("Redirecionando para:", redirectTo)
        
        // Salvar o usuário atual no localStorage
        const user = localStorage.getItem("currentUser")
        if (user) {
          const userData = JSON.parse(user)
          localStorage.setItem("user", JSON.stringify(userData))
        }
        
        // Redirecionar para o dashboard
        router.push(redirectTo)
      } else if (typeof result === "object" && result.error) {
        setError(result.error)
      } else {
        setError("Credenciais inválidas. Tente novamente.")
      }
    } catch (err) {
      console.error("Erro no login:", err)
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = () => {
    setResetError("")
    setResetSuccess("")
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      setResetError("Informe um email válido.")
      return
    }
    if (resetPassword.length < 6) {
      setResetError("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    if (resetPassword !== resetConfirm) {
      setResetError("As senhas não coincidem.")
      return
    }
    // Buscar usuário no localStorage
    const usersRaw = localStorage.getItem("policiais")
    if (!usersRaw) {
      setResetError("Email não encontrado.")
      return
    }
    const users = JSON.parse(usersRaw)
    const idx = users.findIndex((u: any) => u.email && u.email.toLowerCase() === resetEmail.toLowerCase())
    if (idx === -1) {
      setResetError("Email não encontrado.")
      return
    }
    users[idx].senha = resetPassword
    localStorage.setItem("policiais", JSON.stringify(users))
    setResetSuccess("Senha redefinida com sucesso! Agora você pode fazer login.")
    setResetEmail("")
    setResetPassword("")
    setResetConfirm("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-rota-black p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative h-24 w-24">
            <Image
              src="/images/rota-dignidade.png"
              alt="ROTA - Rondas Ostensivas Tobias de Aguiar"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <Card className="border-rota-darkgold bg-black">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-rota-gold">Área Restrita</CardTitle>
            <CardDescription className="text-center text-rota-darkgold">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-rota-gold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="seu.email@exemplo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black border-rota-darkgold text-rota-gold"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-rota-gold">
                      Senha
                    </Label>
                    <Link href="#" className="text-xs text-rota-darkgold hover:text-rota-gold">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    placeholder="Senha"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-black border-rota-darkgold text-rota-gold"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                    className="border-rota-darkgold text-rota-gold"
                  />
                  <Label htmlFor="remember" className="text-rota-gold">
                    Lembrar de mim
                  </Label>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rota-gold text-black hover:bg-rota-darkgold"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Link href="/" className="text-xs text-rota-darkgold hover:text-rota-gold">
              Voltar ao site
            </Link>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>Informe seu email cadastrado e defina uma nova senha.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {resetError && <Alert variant="destructive"><AlertDescription>{resetError}</AlertDescription></Alert>}
            {resetSuccess && <Alert className="bg-green-800 border-green-600"><AlertDescription>{resetSuccess}</AlertDescription></Alert>}
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input id="resetEmail" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resetPassword">Nova Senha</Label>
              <Input id="resetPassword" type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resetConfirm">Confirmar Nova Senha</Label>
              <Input id="resetConfirm" type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetOpen(false)}>Cancelar</Button>
            <Button onClick={handleResetPassword}>Redefinir Senha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
