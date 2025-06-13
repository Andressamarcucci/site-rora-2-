'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink } from "lucide-react";
// Update the import path below if your Button component is located elsewhere
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
// Removed unused import: import { toast } from "../../../../components/ui/use-toast";

interface Live {
  id: string;
  policialId: string;
  policialNome: string;
  link: string;
  plataforma: "TikTok" | "Twitch" | "YouTube" | "Outras";
  descricao?: string;
  dataInicio: string;
  status: "ativa" | "finalizada";
}

interface User {
  id: string;
  name: string;
  role: "admin" | "policial";
}

export default function LivesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lives, setLives] = useState<Live[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
 link: string;
    plataforma: Live["plataforma"] | undefined;
    descricao: string;
  }>({
    link: "",
    plataforma: undefined,
    descricao: "",
  });

  useEffect(() => {
    // Carregar usuário atual
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
      return;
    }

    // Carregar lives
    const storedLives = localStorage.getItem("lives");
    if (storedLives) {
      const parsedLives = JSON.parse(storedLives).map((live: any) => ({
        ...live,
        status: live.status === "ativa" ? "ativa" : "finalizada"
      })) as Live[];
      setLives(parsedLives);
    }

    setIsLoading(false);
  }, [router]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlataformaChange = (value: Live["plataforma"]) => {
    setFormData(prev => ({
      ...prev,
      plataforma: value
    }));
  };

  const handleAddLive = () => {
    if (!currentUser) return;

    if (!formData.link || !formData.plataforma) {
      setError("Link e plataforma são obrigatórios");
      return;
    }

    if (!validateUrl(formData.link)) {
      setError("Link inválido");
      return;
    }

    const newLive: Live = {
      id: Date.now().toString(),
      policialId: currentUser.id,
      policialNome: currentUser.name,
      link: formData.link,
      plataforma: formData.plataforma as Live["plataforma"],
      descricao: formData.descricao,
      dataInicio: new Date().toISOString(),
      status: "ativa"
    };

    const updatedLives = [...lives, newLive];
    setLives(updatedLives);
    localStorage.setItem("lives", JSON.stringify(updatedLives));

    // Notificar outros usuários (simulado com localStorage)
    const notification = {
      type: "live",
      message: `🚨 ${currentUser.name} iniciou uma live! Clique para assistir.`,
      link: formData.link,
      plataforma: formData.plataforma,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("lastNotification", JSON.stringify(notification));

    setSuccess("Live publicada com sucesso!");
    setIsDialogOpen(false);
 setFormData({ link: "", plataforma: undefined, descricao: "" }); // Keep undefined for initial state
  };

  const handleFinalizarLive = (liveId: string) => {
    const updatedLives = lives.map(live =>
 live.id === liveId ? { ...live, status: "finalizada" as "finalizada" } : live
    );
    setLives(updatedLives);
    localStorage.setItem("lives", JSON.stringify(updatedLives));
    setSuccess("Live finalizada com sucesso!");
  };

  const activeLives = lives.filter(live => live.status === "ativa");

  return (
    <div className="space-y-8 min-h-screen w-full pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Lives</h2>
          <p className="text-rota-darkgold">Gerencie as transmissões ao vivo dos policiais.</p>
        </div>

        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="flex items-center gap-2 bg-rota-gold text-black hover:bg-amber-500"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Live</span>
        </Button>
      </div>

      {(error || success) && (
        <div className="mb-6">
          {error && (
            <Alert variant="destructive" className="bg-red-900 border-red-700">
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-800 border-green-600">
              <AlertDescription className="text-white">{success}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-rota-gold">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : lives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-rota-gold">
                  Nenhuma live encontrada.
                </TableCell>
              </TableRow>
            ) : (
              lives.map((live) => (
                <TableRow key={live.id}>
                  <TableCell className="text-rota-gold">{live.policialNome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-rota-darkgold text-rota-gold">
                      {live.plataforma}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={live.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rota-gold hover:text-rota-lightgold flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Assistir
                    </a>
                  </TableCell>
                  <TableCell className="text-rota-gold">
                    {new Date(live.dataInicio).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        live.status === "ativa"
                          ? "bg-green-900 text-green-200"
                          : "bg-gray-900 text-gray-200"
                      }
                    >
                      {live.status === "ativa" ? "Ao Vivo" : "Finalizada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {live.status === "ativa" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFinalizarLive(live.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Finalizar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold">
          <DialogHeader>
            <DialogTitle className="text-[#ffbf00]">Nova Live</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              Preencha os dados para iniciar uma nova transmissão
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link" className="text-rota-gold">Link da Live*</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://..."
                className="bg-black border-rota-darkgold text-rota-lightgold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plataforma" className="text-rota-gold">Plataforma*</Label>
              <Select
  value={formData.plataforma ?? ""}
  onValueChange={(value) => handlePlataformaChange(value as Live["plataforma"])}
  >
                <SelectTrigger className="bg-black border-rota-darkgold text-rota-lightgold">
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Twitch">Twitch</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Outras">Outras</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-rota-gold">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Adicione uma descrição para sua live..."
                className="bg-black border-rota-darkgold text-rota-lightgold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="text-rota-gold border-rota-darkgold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddLive}
              className="bg-rota-gold text-black hover:bg-amber-500"
            >
              Publicar Live
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}