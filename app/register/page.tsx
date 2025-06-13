"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, AlertCircle, Eye, EyeOff, UserPlus, LogIn } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser } from "@/lib/auth-utils"

export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function RegisterFormInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rank, setRank] = useState("ESTÁGIO");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ranks/Patentes disponíveis
  const availableRanks = [
    "ESTÁGIO",
    "CABO PM",
    "3° SARGENTO PM",
    "2° SARGENTO PM", 
    "1° SARGENTO PM",
    "SUB TENENTE PM",
    "2° TENENTE PM",
    "1° TENENTE PM",
    "CAPITÃO PM",
    "MAJOR PM",
    "TENENTE CORONEL PM"
  ];

  // Determina se a patente é de comando (para redirecionamento)
  const isCommandRank = (rank: string) => {
    return ["MAJOR PM", "TENENTE CORONEL PM"].includes(rank);
  };

  // Obter mensagem da URL, se existir
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setError(message)
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validações básicas
    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Você deve aceitar os termos e condições")
      setIsLoading(false)
      return
    }

    try {
      const result = await registerUser({
        name,
        email,
        password,
        rank
      })

      if (result === true || (typeof result === "object" && result.success)) {
        // Determinar para qual página de login redirecionar com base na patente
        const redirectPath = isCommandRank(rank) 
          ? "/admin/login" 
          : "/login";
        
        const message = isCommandRank(rank)
          ? "Cadastro de Comando realizado com sucesso! Faça login para continuar."
          : "Cadastro realizado com sucesso! Faça login para continuar.";
        
        setSuccess(`Registro concluído com sucesso! Redirecionando para ${isCommandRank(rank) ? 'painel de comando' : 'painel policial'}...`)
        
        // Limpar campos
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setRank("ESTÁGIO")
        setAcceptTerms(false)
        
        // Redirecionar para a página de login após um breve delay
        setTimeout(() => {
          router.push(`${redirectPath}?message=${encodeURIComponent(message)}`)
        }, 2000)
      } else if (typeof result === "object" && !result.success) {
        setError(result.error || "Erro ao registrar. Tente novamente.")
      }
    } catch (err) {
      console.error("Erro no registro:", err)
      setError("Ocorreu um erro ao registrar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  };

  // Log para depuração
  useEffect(() => {
    console.log("Página de registro renderizada")
  }, [])

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

        <Card className="border-rota-darkgold bg-rota-gray">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-rota-gold">Registro de Usuário</CardTitle>
            <CardDescription className="text-center text-rota-darkgold">
              Crie sua conta para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-900 border-green-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-rota-gold">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-black border-rota-darkgold text-rota-gold"
                  />
                </div>
                
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
                  <Label htmlFor="rank" className="text-rota-gold">
                    Patente / Cargo
                  </Label>
                  <Select value={rank} onValueChange={setRank}>
                    <SelectTrigger className="bg-black border-rota-darkgold text-rota-gold">
                      <SelectValue placeholder="Selecione sua patente" />
                    </SelectTrigger>
                    <SelectContent className="bg-rota-gray border-rota-darkgold">
                      {availableRanks.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-rota-gold">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black border-rota-darkgold text-rota-gold pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-rota-darkgold hover:text-rota-gold"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-rota-gold">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-black border-rota-darkgold text-rota-gold pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-rota-darkgold hover:text-rota-gold"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Esconder senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    className="border-rota-darkgold data-[state=checked]:bg-rota-gold data-[state=checked]:text-black"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-rota-gold"
                  >
                    Aceito os termos e condições
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-rota-gold text-black hover:bg-rota-lightgold"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-rota-darkgold">
              <span>Já tem uma conta?</span>{" "}
              <Link href="/login" className="font-medium hover:text-rota-gold">
                Faça login
              </Link>
            </div>
            <div className="text-center text-sm text-rota-darkgold">
              <Link href="/" className="hover:text-rota-gold">
                Voltar ao site
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Componente principal que renderiza o formulário interno dentro de um Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-rota-black p-4">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-4 text-rota-gold">Carregando...</p>
        </div>
      </div>
    }>
      <RegisterFormInternal />
    </Suspense>
  );
} 