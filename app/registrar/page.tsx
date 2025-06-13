"use client"

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente de registro com noSuspense para evitar hidratação parcial
const RegisterFormDynamic = dynamic(
  () => import('@/app/register/page'),
  { 
    ssr: false,
    loading: () => <LoadingFallback />
  }
);

// Componente de fallback enquanto o componente principal carrega
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rota-black p-4">
      <div className="animate-pulse text-center">
        <div className="h-12 w-12 rounded-full bg-rota-gold mx-auto"></div>
        <p className="mt-4 text-rota-gold">Carregando...</p>
      </div>
    </div>
  );
}

export default function RegistrarPage() {
  // Renderizando diretamente sem Suspense adicional, já que o dynamic já tem loading
  return <RegisterFormDynamic />;
} 