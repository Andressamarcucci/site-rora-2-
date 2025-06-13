import type { User, UserRole } from "./types"

// Adicionar usuários padrão
const DEFAULT_ADMINS: User[] = [
  {
    id: "admin-1",
    name: "Administrador Padrão",
    email: "admin@rota.com",
    role: "admin" as UserRole,
    permissions: [
      "gerenciar_usuarios",
      "gerenciar_membros",
      "gerenciar_hierarquias",
      "gerenciar_fardamentos",
      "gerenciar_viaturas",
      "visualizar_relatorios",
    ],
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_USERS = [
  {
    email: "usuario@rota.com",
    name: "Usuário Padrão",
    role: "Administrador",
    lastLogin: new Date().toISOString(),
  }
];

// Verificar se estamos no navegador
const isBrowser = typeof window !== 'undefined';

// Function to initialize default admin if none exists
export function initializeDefaultAdmin(): void {
  if (!isBrowser) return;
  
  try {
    // Check if admins array exists in localStorage
    const admins = localStorage.getItem("admins")

    if (!admins || JSON.parse(admins).length === 0) {
      // Save to localStorage
      localStorage.setItem("admins", JSON.stringify(DEFAULT_ADMINS))
      console.log("Default admin user initialized")
    }
  } catch (error) {
    console.error("Error initializing default admin:", error)
  }
}

// Function to validate admin login
export function validateAdminLogin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  try {
    let admins: User[] = DEFAULT_ADMINS;
    
    // Se estamos no navegador, tente pegar do localStorage
    if (isBrowser) {
      const adminsJson = localStorage.getItem("admins")
      if (adminsJson) {
        admins = JSON.parse(adminsJson)
      } else {
        // Se não existir no localStorage, inicialize com o padrão
        localStorage.setItem("admins", JSON.stringify(DEFAULT_ADMINS))
        admins = DEFAULT_ADMINS
      }
    }
    
    // Find admin with matching email
    const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase())

    if (!admin) {
      return {
        success: false,
        error: "Email não encontrado. Verifique suas credenciais.",
      }
    }

    // In a real app, we would hash and compare passwords
    // For demo purposes, we're using a hardcoded password
    if (password === "admin123") {
      return {
        success: true,
        user: admin,
      }
    } else {
      return {
        success: false,
        error: "Senha incorreta. Tente novamente.",
      }
    }
  } catch (error) {
    console.error("Error validating admin login:", error)
    return {
      success: false,
      error: "Erro ao processar login. Tente novamente mais tarde.",
    }
  }
}

// Function to validate regular user login
export function validateUserLogin(email: string, password: string): { success: boolean; user?: any; error?: string } {
  try {
    // Verificar se o email é um dos usuários padrão
    const defaultUser = DEFAULT_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (defaultUser && password === "senha123") {
      return {
        success: true,
        user: defaultUser,
      }
    }
    
    // Para outros emails, verificar apenas a senha
    if (password === "senha123") {
      const user = {
        email,
        name: email.split("@")[0],
        role: "Usuário",
        lastLogin: new Date().toISOString(),
      }
      return {
        success: true,
        user,
      }
    } else {
      return {
        success: false,
        error: "Senha incorreta. Para demonstração, use 'senha123'.",
      }
    }
  } catch (error) {
    console.error("Error validating user login:", error)
    return {
      success: false,
      error: "Erro ao processar login. Tente novamente mais tarde.",
    }
  }
}

// Função para adicionar policial à hierarquia
function adicionarPolicialAHierarquia(policial: any) {
  try {
    // Carregar hierarquias
    const hierarquiasJson = localStorage.getItem("hierarquias");
    let hierarquias = hierarquiasJson ? JSON.parse(hierarquiasJson) : [];
    
    // Encontrar a hierarquia correspondente à patente do policial
    const hierarquia = hierarquias.find((h: any) => 
      h.nome.toUpperCase() === policial.rank.toUpperCase() || 
      h.nome.toUpperCase() === policial.patente.toUpperCase()
    );
    
    if (hierarquia) {
      // Atualizar a hierarquia com o policial
      hierarquia.policial = policial.nome;
      hierarquia.patente = policial.rank;
      
      // Salvar hierarquias atualizadas
      localStorage.setItem("hierarquias", JSON.stringify(hierarquias));
      console.log(`Policial ${policial.nome} adicionado à hierarquia ${hierarquia.nome}`);
    } else {
      console.warn(`Hierarquia não encontrada para a patente ${policial.rank}`);
    }
  } catch (error) {
    console.error("Erro ao adicionar policial à hierarquia:", error);
  }
}

// Função para registrar usuário
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  rank?: string;
}): Promise<boolean | {success: boolean; error: string}> {
  try {
    if (!isBrowser) return { success: false, error: "Operação disponível apenas no navegador" };
    
    // Validar dados
    if (!userData.name || !userData.email || !userData.password) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }
    
    // Verificar se o email já está em uso
    const usersJson = localStorage.getItem("users");
    let users = usersJson ? JSON.parse(usersJson) : [];
    
    const existingUser = users.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return { success: false, error: "Este email já está em uso" };
    }
    
    // Criar novo usuário
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      // Em uma aplicação real, a senha seria criptografada
      password: userData.password, 
      rank: userData.rank || "ESTÁGIO",
      patente: userData.rank || "ESTÁGIO", // Garantir que a patente também esteja preenchida
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: "ativo"
    };
    
    console.log("Registrando novo usuário:", newUser);
    
    // Adicionar à lista de usuários
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Adicionar o usuário na patente/hierarquia correspondente
    try {
      // Verificar e inicializar a estrutura de hierarquias se não existir
      const hierarquiasIniciais = [
        { id: "1", nome: "CORONEL PM", nivel: 1, descricao: "Patente mais alta do batalhão", permissoes: ["comando_geral"], createdAt: new Date().toISOString() },
        { id: "2", nome: "TENENTE CORONEL PM", nivel: 2, descricao: "Segunda patente mais alta", permissoes: ["comando_operacional"], createdAt: new Date().toISOString() },
        { id: "3", nome: "MAJOR PM", nivel: 3, descricao: "Oficial superior", permissoes: ["comando_parcial"], createdAt: new Date().toISOString() },
        { id: "4", nome: "CAPITÃO PM", nivel: 4, descricao: "Oficial intermediário", permissoes: ["lideranca"], createdAt: new Date().toISOString() },
        { id: "5", nome: "1° TENENTE PM", nivel: 5, descricao: "Oficial subalterno", permissoes: ["supervisao"], createdAt: new Date().toISOString() },
        { id: "6", nome: "2° TENENTE PM", nivel: 6, descricao: "Oficial subalterno", permissoes: ["supervisao"], createdAt: new Date().toISOString() },
        { id: "7", nome: "SUB TENENTE PM", nivel: 7, descricao: "Graduado mais alto", permissoes: ["supervisao"], createdAt: new Date().toISOString() },
        { id: "8", nome: "1° SARGENTO PM", nivel: 8, descricao: "Graduado superior", permissoes: ["supervisao"], createdAt: new Date().toISOString() },
        { id: "9", nome: "2° SARGENTO PM", nivel: 9, descricao: "Graduado intermediário", permissoes: ["patrulha"], createdAt: new Date().toISOString() },
        { id: "10", nome: "3° SARGENTO PM", nivel: 10, descricao: "Graduado", permissoes: ["patrulha"], createdAt: new Date().toISOString() },
        { id: "11", nome: "CABO PM", nivel: 11, descricao: "Graduado", permissoes: ["patrulha"], createdAt: new Date().toISOString() },
        { id: "12", nome: "ESTÁGIO", nivel: 12, descricao: "Iniciante", permissoes: ["patrulha"], createdAt: new Date().toISOString() }
      ];
      
      const hierarquiasJson = localStorage.getItem("hierarquias");
      if (!hierarquiasJson) {
        localStorage.setItem("hierarquias", JSON.stringify(hierarquiasIniciais));
        console.log("Inicializado estrutura de hierarquias");
      }
      
      // Carregar a lista de policiais
      const policiaisJson = localStorage.getItem("policiais");
      let policiais = policiaisJson ? JSON.parse(policiaisJson) : [];
      
      // Adicionar o novo usuário como policial com a patente selecionada
      const novoPolicial = {
        id: newUser.id,
        nome: newUser.name,
        name: newUser.name, // Compatibilidade com ambos os formatos
        email: newUser.email,
        rg: `RP${Math.floor(10000 + Math.random() * 90000)}`, // RG fictício
        graduacao: newUser.rank,
        rank: newUser.rank, // Compatibilidade com ambos os formatos
        patente: newUser.rank, // Compatibilidade com ambos os formatos
        unidade: "Unidade Central",
        funcao: "Policial",
        status: "ativo",
        dataIngresso: new Date().toISOString().split('T')[0],
        avatar: null
      };
      
      policiais.push(novoPolicial);
      localStorage.setItem("policiais", JSON.stringify(policiais));
      
      // Adicionar o policial à hierarquia
      adicionarPolicialAHierarquia(novoPolicial);
      
      console.log(`Usuário adicionado à patente ${newUser.rank}`);
      
      // Adicionar permissões básicas para o policial
      const permissoesPoliciaisJson = localStorage.getItem("permissoesPolicial");
      let permissoesPoliciais = permissoesPoliciaisJson ? JSON.parse(permissoesPoliciaisJson) : {};
      
      // Definir permissões básicas baseadas na patente
      let permissoesBasicas = ["patrulha", "abordagem"];
      
      // Adicionar permissões com base na graduação
      if (["TENENTE CORONEL PM", "MAJOR PM", "CORONEL PM"].includes(newUser.rank)) {
        permissoesBasicas = [...permissoesBasicas, "operacao_tatica", "lider_operacao", "acesso_armamentos", "acesso_viaturas", "treinamento", "administracao"];
      } else if (["CAPITÃO PM", "1° TENENTE PM", "2° TENENTE PM"].includes(newUser.rank)) {
        permissoesBasicas = [...permissoesBasicas, "operacao_tatica", "lider_operacao", "acesso_viaturas"];
      } else if (["SUB TENENTE PM", "1° SARGENTO PM", "2° SARGENTO PM", "3° SARGENTO PM"].includes(newUser.rank)) {
        permissoesBasicas = [...permissoesBasicas, "operacao_tatica", "acesso_viaturas"];
      }
      
      permissoesPoliciais[newUser.id] = permissoesBasicas;
      localStorage.setItem("permissoesPolicial", JSON.stringify(permissoesPoliciais));
      
      // Se o usuário for de um rank administrativo, adicionar também aos admins
      if (["MAJOR PM", "TENENTE CORONEL PM"].includes(newUser.rank)) {
        const adminsJson = localStorage.getItem("admins");
        let admins = adminsJson ? JSON.parse(adminsJson) : [];
        
        const novoAdmin = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: "admin",
          rank: newUser.rank,
          permissions: [
            "gerenciar_usuarios",
            "visualizar_relatorios"
          ],
          createdAt: new Date().toISOString(),
        };
        
        admins.push(novoAdmin);
        localStorage.setItem("admins", JSON.stringify(admins));
        console.log("Usuário adicionado como admin devido ao rank elevado");
      }
    } catch (hierarquiaError) {
      console.error("Erro ao adicionar usuário à hierarquia:", hierarquiaError);
      // Não falhar o registro se a atualização da hierarquia falhar
    }
    
    return { success: true, error: "" };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, error: "Ocorreu um erro ao registrar o usuário. Tente novamente." };
  }
}

// Função para gerar um refresh token
function generateRefreshToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Função para salvar os tokens no localStorage
function saveTokens(userId: string, refreshToken: string, rememberMe: boolean) {
  const tokens = {
    userId,
    refreshToken,
    expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 30 dias ou 24 horas
  };
  localStorage.setItem("authTokens", JSON.stringify(tokens));
}

// Função para verificar se o refresh token é válido
function isRefreshTokenValid(): boolean {
  const tokens = localStorage.getItem("authTokens");
  if (!tokens) return false;

  const { expiresAt } = JSON.parse(tokens);
  return Date.now() < expiresAt;
}

// Função para renovar a sessão
function refreshSession(userId: string, rememberMe: boolean) {
  const refreshToken = generateRefreshToken();
  saveTokens(userId, refreshToken, rememberMe);
  return refreshToken;
}

// Atualizar a função de login para também verificar os usuários registrados
export async function loginUser(email: string, password: string, rememberMe: boolean) {
  try {
    // Verificar credenciais do usuário padrão
    if (email === "usuario@rota.com" && password === "senha123") {
      const userData = {
        id: "user-1",
        email,
        name: "Usuário Padrão",
        role: "user"
      };
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    
    // Verificar credenciais de admin
    const adminResult = validateAdminLogin(email, password);
    if (adminResult.success && adminResult.user) {
      localStorage.setItem('user', JSON.stringify(adminResult.user));
      return true;
    }
    
    return { error: "Credenciais inválidas" };
  } catch (error) {
    console.error("Erro no login:", error);
    return { error: "Erro ao fazer login" };
  }
}

export async function loginAdmin(email: string, password: string): Promise<boolean | {success: boolean; error: string}> {
  const result = validateAdminLogin(email, password)
  if (result.success && result.user) {
    if (isBrowser) {
      // Adicionar timestamp de login
      const adminWithTimestamp = {
        ...result.user,
        lastLogin: new Date().toISOString()
      }
      localStorage.setItem("currentAdmin", JSON.stringify(adminWithTimestamp))
    }
    return true
  } else {
    return {
      success: false,
      error: result.error || "Credenciais inválidas. Tente novamente."
    }
  }
}

// Função para verificar e renovar a sessão automaticamente
export function checkAndRefreshSession(): boolean {
  if (!isBrowser) return false;
  
  try {
    console.log("Verificando sessão...");
    const tokens = localStorage.getItem("authTokens");
    if (!tokens) {
      console.log("Nenhum token encontrado");
      return false;
    }
    
    const { userId, expiresAt } = JSON.parse(tokens);
    console.log("Token encontrado:", { userId, expiresAt });
    
    // Se o token estiver expirado, verificar se há um refresh token válido
    if (Date.now() >= expiresAt) {
      console.log("Token expirado, verificando refresh token");
      if (!isRefreshTokenValid()) {
        console.log("Refresh token inválido, limpando sessão");
        // Se não houver refresh token válido, limpar sessão
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authTokens");
        return false;
      }
      
      // Renovar a sessão
      const user = localStorage.getItem("currentUser");
      if (user) {
        console.log("Renovando sessão");
        const userData = JSON.parse(user);
        refreshSession(userId, true); // Sempre renovar com "lembrar-me" ativado
        return true;
      }
    }
    
    console.log("Sessão válida");
    return true;
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return false;
  }
}
