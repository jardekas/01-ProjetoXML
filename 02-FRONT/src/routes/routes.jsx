import Dashboard from "../pages/dashboard";
import Documentos from "../pages/documentos";
import Usuarios from "../pages/usuarios";
import Configuracoes from "../pages/configuracoes";
import RedefinirSenha from "../pages/redefSenha";
import Login from "../pages/login";
import Cadastro from "../pages/cadastro";

// Mapeamento de todas as rotas da aplicação

export const ROUTES = {
  CADASTRO: {
    path: "/cadastro",
    label: "Cadastro",
    component: Cadastro,
    showInMenu: false,
  },
  LOGIN: {
    path: "/",
    label: "Login",
    component: Login,
    showInMenu: false,
  },
  REDEFINIRSENHA: {
    path: "/redefinir_senha",
    label: "Redefinir Senha",
    component: RedefinirSenha,
    showInMenu: false,
  },
  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    component: Dashboard,
    showInMenu: true,
  },
  DOCUMENTOS: {
    path: "/documentos",
    label: "Documentos",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    component: Documentos,
    showInMenu: true,
  },
  USUARIOS: {
    path: "/usuarios",
    label: "Usuários",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    component: Usuarios,
    showInMenu: true,
  },
  CONFIGURACOES: {
    path: "/configuracoes",
    label: "Configurações",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    component: Configuracoes,
    showInMenu: true,
  },
};

// Array de rotas protegidas (com sidebar)
export const protectedRoutes = Object.values(ROUTES).filter(
  (route) => route.showInMenu,
);

// Array de rotas públicas (sem sidebar)
export const publicRoutes = Object.values(ROUTES).filter(
  (route) => !route.showInMenu,
);
