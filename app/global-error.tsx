'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar o erro no console ou em um serviço de monitoramento
    console.error('Erro global na aplicação:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-rota-black p-4">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Erro na aplicação</h2>
            <p className="text-rota-darkgold">
              Ocorreu um erro crítico. Nossa equipe foi notificada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                onClick={reset}
                className="bg-[#ffbf00] text-black hover:bg-amber-500"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 