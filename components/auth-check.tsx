"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Verificar se existe um usuário logado
    const user = localStorage.getItem('user');
    if (!user) {
      // Se não houver usuário, redirecionar para o login
      router.push('/login?redirectTo=' + window.location.pathname);
    }
  }, [router]);

  return <>{children}</>;
}
