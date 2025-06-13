"use client";

import { AuthCheck } from '@/components/auth-check';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { User } from "@/lib/types";

interface Live {
  id: string;
  policialId: string;
  policialName: string;
  plataforma: string;
  link: string;
  inicio: string;
  status: "ativa" | "encerrada";
  notificada: boolean;
}

export default function PolicialLivesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [lives, setLives] = useState<Live[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    plataforma: "",
    link: ""
  });

  useEffect(() => {
    // Carregar informações do usuário atual
    try {
      const user = localStorage.getItem("currentUser");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.role !== "policial" && userData.role !== "admin") {
          router.push("/login");
          return;
        }
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }

    // Carregar lives do localStorage
    const storedLives = localStorage.getItem("lives");
    if (storedLives) {
      setLives(JSON.parse(storedLives));
    }

    setIsLoading(false);
  }, [router]);

  const validateLiveLink = (platform: string, link: string): boolean => {
    const patterns = {
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
      twitch: /^(https?:\/\/)?(www\.)?twitch\.tv\/.+/i,
      tiktok: /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+/i,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i
    };

    if (platform === "outro") return true;
    return patterns[platform as keyof typeof patterns]?.test(link) || false;
  };

  const handleAddLive = () => {
    if (!formData.plataforma || !formData.link) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    if (!validateLiveLink(formData.plataforma, formData.link)) {
      toast({
        title: "Erro",
        description: "O link fornecido não é válido para a plataforma selecionada",
        variant: "destructive"
      });
      return;
    }

    const newLive: Live = {
      id: Date.now().toString(),
      policialId: currentUser?.id || "",
      policialName: currentUser?.name || "",
      plataforma: formData.plataforma,
      link: formData.link,
      inicio: new Date().toISOString(),
      status: "ativa",
      notificada: false
    };

    const updatedLives = [...lives, newLive];
    setLives(updatedLives);
    localStorage.setItem("lives", JSON.stringify(updatedLives));
    
    // Notificar outros policiais
    notifyPoliciais(newLive);
    
    setFormData({ plataforma: "", link: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Live iniciada com sucesso!",
    });
  };

  const handleEncerrarLive = (liveId: string) => {
    const updatedLives = lives.map(live => 
 live.id === liveId ? { ...live, status: "encerrada" as "encerrada" } : live
    );
    setLives(updatedLives);
    localStorage.setItem("lives", JSON.stringify(updatedLives));
    
    toast({
      title: "Sucesso",
      description: "Live encerrada com sucesso!",
    });
  };

  const notifyPoliciais = (live: Live) => {
    // Buscar lista de policiais
    const policiais = JSON.parse(localStorage.getItem("policiais") || "[]");
    
    // Filtrar policiais ativos (excluindo o próprio)
    const policiaisAtivos = policiais.filter((p: any) => 
      p.status === "ativo" && p.id !== currentUser?.id
    );

    // Criar notificação para cada policial
    policiaisAtivos.forEach((policial: any) => {
      const notificacoes = JSON.parse(localStorage.getItem(`notificacoes_${policial.id}`) || "[]");
      notificacoes.push({
        id: Date.now().toString(),
        tipo: "live",
        mensagem: `${live.policialName} iniciou uma live na plataforma ${live.plataforma}`,
        link: live.link,
        data: new Date().toISOString(),
        lida: false
      });
      localStorage.setItem(`notificacoes_${policial.id}`, JSON.stringify(notificacoes));
    });
  };

  const activeLives = lives.filter(live => live.status === "ativa");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-center">
          <div className="h-6 w-6 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-2 text-xs text-rota-darkgold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full min-h-screen">
      <aside className="w-80 p-4 border-r border-rota-darkgold h-full flex-shrink-0">
        {/* Filtros */}
      </aside>
      <section className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6 w-full h-full min-h-screen flex flex-col">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">
                Lives
              </h2>
              <p className="text-rota-darkgold">
                Gerencie suas transmissões ao vivo e acompanhe as lives de outros policiais.
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-rota-gold text-black hover:bg-amber-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Iniciar Live
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/20 bg-rota-gray border-rota-darkgold h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#ffbf00]">Lives Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#ffbf00]">
                  {activeLives.length}
                </div>
                <p className="text-xs text-rota-darkgold">Transmissões em andamento</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border shadow-md overflow-auto mb-8 w-full max-h-[calc(100vh-22rem)]">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-rota-gray">
                  <TableHead className="text-[#ffbf00]">Policial</TableHead>
                  <TableHead className="text-[#ffbf00]">Plataforma</TableHead>
                  <TableHead className="text-[#ffbf00]">Link</TableHead>
                  <TableHead className="text-[#ffbf00]">Início</TableHead>
                  <TableHead className="text-[#ffbf00]">Status</TableHead>
                  <TableHead className="text-right text-[#ffbf00]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lives.map((live) => (
                  <TableRow key={live.id} className="border-rota-darkgold">
                    <TableCell className="font-medium text-rota-gold">{live.policialName}</TableCell>
                    <TableCell className="text-rota-darkgold">{live.plataforma}</TableCell>
                    <TableCell>
                      <a 
                        href={live.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-rota-gold hover:text-amber-500 flex items-center gap-1"
                      >
                        Acessar <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-rota-darkgold">
                      {new Date(live.inicio).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={live.status === "ativa" ? "default" : "secondary"}
                        className={live.status === "ativa" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {live.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {live.policialId === currentUser?.id && live.status === "ativa" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEncerrarLive(live.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Encerrar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="bg-rota-gray border-rota-darkgold">
              <DialogHeader>
                <DialogTitle className="text-[#ffbf00]">Iniciar Nova Live</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="plataforma" className="text-rota-darkgold">
                    Plataforma
                  </Label>
                  <Select
                    value={formData.plataforma}
                    onValueChange={(value) => setFormData({ ...formData, plataforma: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitch">Twitch</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link" className="text-rota-darkgold">
                    Link da Live
                  </Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="Cole o link da sua live"
                    className="border-rota-darkgold"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-rota-darkgold text-rota-darkgold hover:bg-rota-gray/50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddLive}
                  className="bg-rota-gold text-black hover:bg-amber-500"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Iniciar e Notificar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}