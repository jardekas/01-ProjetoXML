// Somente para quando a API falhar, para não deixar a tela vazia. testes para apresentação, não é para uso em produção.
// Objeto vazio para novo usuário
export const EMPTY_USER = {
  nome: "",
  email: "",
  cpf: "",
  cnpj: "",
  telefone: "",
  tipo: "Empresa",
  crc: "",
  senha: "",
  confirmarSenha: "",
  flg_admin: false,
};

// Estilos para status
export const STATUS_STYLES = {
  Ativo: { bg: "#1d4ed8", text: "white" },
  Inativo: { bg: "#f1f5f9", text: "#64748b", border: "1px solid #e2e8f0" },
};

// Estilos para tipo de usuário
export const TIPO_STYLES = {
  Admin: { bg: "#dc2626", text: "white" },
  Master: { bg: "#7c3aed", text: "white" },
  Usuário: { bg: "transparent", text: "#475569", border: "none" },
  Empresa: { bg: "#059669", text: "white" },
  Contador: { bg: "#b45309", text: "white" },
};

// Permissões disponíveis
export const PERMISSOES = [
  {
    id: 1,
    label: "Visualizar documentos",
    desc: "Acesso somente leitura a documentos fiscais",
  },
  {
    id: 2,
    label: "Importar XMLs",
    desc: "Pode importar arquivos XML ao sistema",
  },
  {
    id: 3,
    label: "Gerenciar clientes",
    desc: "Criar, editar e excluir clientes",
  },
  {
    id: 4,
    label: "Gerar relatórios",
    desc: "Acesso à geração de relatórios fiscais",
  },
  {
    id: 5,
    label: "Administrar usuários",
    desc: "Gerenciar outros usuários do sistema",
  },
];

// Função para calcular estatísticas (baseada nos dados)
export const getStats = (users) => {
  return {
    total: String(users.length),
    ativos: String(users.filter((u) => u.status === "Ativo").length),
    inativos: String(users.filter((u) => u.status === "Inativo").length),
    admins: String(users.filter((u) => u.tipo === "Admin").length),
    contadores: String(users.filter((u) => u.tipo === "Contador").length),
    masters: String(users.filter((u) => u.tipo === "Master").length),
  };
};

// Dados mockados APENAS para fallback (se a API falhar)
export const USERS_MOCK = [
  {
    id: 1,
    nome: "Maria Santos",
    cpf: "123.456.789-00",
    email: "maria@empresa.com",
    status: "Ativo",
    tipo: "Admin",
    criacao: "14/01/2024",
  },
  {
    id: 2,
    nome: "João Oliveira",
    cpf: "987.654.321-00",
    email: "joao@empresa.com",
    status: "Ativo",
    tipo: "Usuário",
    criacao: "19/02/2024",
  },
  {
    id: 3,
    nome: "Ana Costa",
    cpf: "555.444.333-22",
    email: "ana@empresa.com",
    status: "Inativo",
    tipo: "Usuário",
    criacao: "09/03/2024",
  },
];
