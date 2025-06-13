"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    console.log("Redirecionando para página de registro...");
    router.push("/register");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rota-black p-4 text-rota-gold">
      <p>Redirecionando para a página de registro...</p>
    </div>
  );
} 