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
import { Users, AlertCircle, Eye, EyeOff } from "lucide-react"
import { loginAdmin } from "@/lib/auth-utils"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      const result = await loginAdmin(email, password)
      if (result === true) {
        // Verificar se existe um redirectTo na URL
        const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'
        router.push(redirectTo)
      } else if (typeof result === "object" && result.error) {
        setError(result.error)
      } else {
        setError("Credenciais inválidas. Tente novamente.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
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
    </div>
  )
}
