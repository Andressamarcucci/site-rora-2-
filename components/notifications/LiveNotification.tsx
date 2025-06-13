"use client"

import { useState, useEffect } from "react"
import { Bell, X, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Notification {
  id: string
  tipo: "live"
  mensagem: string
  link: string
  data: string
  lida: boolean
}

interface LiveNotificationProps {
  userId: string
}

export function LiveNotification({ userId }: LiveNotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Carregar notificações do localStorage
    const storedNotifications = localStorage.getItem(`notificacoes_${userId}`)
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications)
      setNotifications(parsedNotifications)
      setUnreadCount(parsedNotifications.filter((n: Notification) => !n.lida).length)
    }

    // Verificar novas notificações a cada 30 segundos
    const interval = setInterval(() => {
      const updatedNotifications = localStorage.getItem(`notificacoes_${userId}`)
      if (updatedNotifications) {
        const parsedNotifications = JSON.parse(updatedNotifications)
        setNotifications(parsedNotifications)
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.lida).length)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [userId])

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, lida: true }
        : notification
    )
    setNotifications(updatedNotifications)
    localStorage.setItem(`notificacoes_${userId}`, JSON.stringify(updatedNotifications))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      lida: true
    }))
    setNotifications(updatedNotifications)
    localStorage.setItem(`notificacoes_${userId}`, JSON.stringify(updatedNotifications))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    localStorage.setItem(`notificacoes_${userId}`, JSON.stringify([]))
    setUnreadCount(0)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5 text-rota-gold" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-rota-gray border-l border-rota-darkgold w-[400px] sm:w-[540px]">
        <SheetHeader className="border-b border-rota-darkgold pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[#ffbf00]">Notificações</SheetTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs border-rota-darkgold text-rota-darkgold hover:bg-rota-gray/50"
                >
                  Marcar todas como lidas
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-xs border-rota-darkgold text-rota-darkgold hover:bg-rota-gray/50"
                >
                  Limpar todas
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>
        <div className="mt-4 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-8 w-8 text-rota-darkgold mx-auto mb-2" />
              <p className="text-rota-darkgold">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.lida
                    ? "border-rota-darkgold/20 bg-rota-gray/50"
                    : "border-rota-darkgold bg-rota-gray"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-rota-gold mb-2">{notification.mensagem}</p>
                    <p className="text-xs text-rota-darkgold">
                      {new Date(notification.data).toLocaleString()}
                    </p>
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-[#ffbf00] hover:text-amber-500"
                    >
                      Acessar live →
                    </a>
                  </div>
                  {!notification.lida && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                      className="h-6 w-6 text-rota-darkgold hover:text-rota-gold"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 