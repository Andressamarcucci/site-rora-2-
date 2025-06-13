import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Advertencia } from "@/lib/types"

interface AdvertenciaNotificationProps {
  policial: Advertencia
  onClose: () => void
}

export function AdvertenciaNotification({ policial, onClose }: AdvertenciaNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50">
      {isVisible && (
        <Alert className="w-full max-w-md">
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{policial.status === 'ativo' ? 'Advertência' : 'Suspensão'}</h3>
                <p className="text-sm text-muted-foreground">
                  {policial.tipo === 'advertencia'
                    ? 'Uma nova advertência foi registrada para o policial.'
                    : `O policial foi suspenso por ${policial.duracao || 'tempo indeterminado'}.`}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
