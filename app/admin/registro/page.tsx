"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, UserPlus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type User, type UserRole, defaultPermissions } from "@/lib/types"
import { initializeDefaultAdmin } from "@/lib/auth-utils"

export default function AdminRegistroPage() {
  const router = useRouter()

  // Estados para o formulário de registro
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [patente, setPatente] = useState("")
  const [role, setRole] = useState<UserRole>("operador")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [codigoConvite, setCodigoConvite] = useState("")

  // Código de convite para registro (em um sistema real, seria gerado dinamicamente)
  const CODIGO_CONVITE_VALIDO = "BTE2023"

  useEffect(() => {
    // Initialize default admin if none exists
    try {
      initializeDefaultAdmin()
    } catch (err) {
      console.error("Failed to initialize default admin:", err)
    }
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setInfo("")
    setIsLoading(true)

    try {
      // Validações
      if (!name.trim()) {
        setError("Por favor, insira seu nome completo.")
        setIsLoading(false)
        return
      }

      if (!email.trim() || !email.includes("@")) {
        setError("Por favor, insira um email válido.")
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.")
        setIsLoading(false)
        return
      }

      // Verificar código de convite
      if (codigoConvite !== CODIGO_CONVITE_VALIDO) {
        setError("Código de convite inválido.")
        setIsLoading(false)
        return
      }

      // Simulação de registro - em um caso real, isso seria uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar se já existe um administrador com esse email
      const admins = JSON.parse(localStorage.getItem("admins") || "[]")
      if (admins.some((a: User) => a.email.toLowerCase() === email.toLowerCase())) {
        setError("Este email já está em uso.")
        setIsLoading(false)
        return
      }

      // Criar novo administrador
      const newAdmin: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        patente,
        createdAt: new Date().toISOString(),
        permissions: defaultPermissions[role],
      }

      // Adicionar à lista de administradores
      admins.push(newAdmin)
      localStorage.setItem("admins", JSON.stringify(admins))

      // Mensagem de sucesso
      setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...")

      // Limpar campos
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setPatente("")
      setCodigoConvite("")

      // Redirecionar para a página de login após um breve delay
      setTimeout(() => {
        router.push(
          "/admin/login?message=" + encodeURIComponent("Cadastro realizado com sucesso! Faça login para continuar."),
        )
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err)
      setError("Ocorreu um erro ao cadastrar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-rota-black">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative h-24 w-24 mx-auto">
                <Image
                  src="/images/rota-logo.png"
                  alt="ROTA - Rondas Ostensivas Tobias de Aguiar"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-rota-gold">Batalhão Tático Especial</h1>
            </Link>
            <p className="text-rota-darkgold mt-2">Cadastro de Novo Administrador</p>
          </div>

          <div className="bg-rota-gray border border-rota-darkgold rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-center text-rota-gold">Criar Nova Conta</h2>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900 border-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">{error}</AlertDescription>
              </Alert>
            )}

            {info && (
              <Alert className="mb-6 bg-blue-900 border-blue-700">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-white">{info}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-800 border-green-600">
                <AlertDescription className="text-white">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-rota-gold">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-black border-rota-darkgold text-rota-lightgold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-rota-gold">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black border-rota-darkgold text-rota-lightgold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-rota-gold">
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black border-rota-darkgold text-rota-lightgold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-rota-gold">
                      Confirmar Senha
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-black border-rota-darkgold text-rota-lightgold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patente" className="text-rota-gold">
                    Patente (opcional)
                  </Label>
                  <Input
                    id="patente"
                    type="text"
                    placeholder="Ex: Coronel, Tenente, etc."
                    value={patente}
                    onChange={(e) => setPatente(e.target.value)}
                    className="bg-black border-rota-darkgold text-rota-lightgold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-rota-gold">
                    Nível de Acesso
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="admin">Administrador (Acesso Total)</option>
                    <option value="moderador">Moderador (Acesso Parcial)</option>
                    <option value="operador">Operador (Acesso Básico)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo-convite" className="text-rota-gold">
                    Código de Convite
                  </Label>
                  <Input
                    id="codigo-convite"
                    type="text"
                    placeholder="Digite o código de convite"
                    value={codigoConvite}
                    onChange={(e) => setCodigoConvite(e.target.value)}
                    required
                    className="bg-black border-rota-darkgold text-rota-lightgold"
                  />
                  <p className="text-xs text-rota-darkgold">Para demonstração, use o código: BTE2023</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Processando..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Cadastrar
                    </>
                  )}
                </Button>

                <div className="text-sm text-center mt-4">
                  <p className="text-rota-darkgold">Já possui uma conta?</p>
                  <Link href="/admin/login" className="text-rota-gold hover:underline">
                    Fazer login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-black py-4 px-4 text-center text-rota-darkgold text-sm border-t border-rota-darkgold">
        <p>© {new Date().getFullYear()} Batalhão Tático Especial - GTA Roleplay</p>
        <p className="mt-1 text-xs italic">"DIGNIDADE ACIMA DE TUDO"</p>
      </footer>
    </div>
  )
}
