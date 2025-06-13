"use client"

import * as React from "react"
import { CheckCircle, X } from "lucide-react"

interface AlertSuccessProps {
  message: string
  onClose: () => void
}

export function AlertSuccess({ message, onClose }: AlertSuccessProps) {
  if (!message) return null
  
  return (
    <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 