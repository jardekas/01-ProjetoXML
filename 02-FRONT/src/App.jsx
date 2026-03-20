import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import Layout from "./components/Layout";
import Login from "./pages/login";
import { AuthProvider } from "./contexts/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Rota de login sem sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas com sidebar */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route
              path={ROUTES.DASHBOARD.path}
              element={<ROUTES.DASHBOARD.component />}
            />
            <Route
              path={ROUTES.DOCUMENTOS.path}
              element={<ROUTES.DOCUMENTOS.component />}
            />
            <Route
              path={ROUTES.USUARIOS.path}
              element={
                <PrivateRoute adminOnly>
                  <ROUTES.USUARIOS.component />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.CONFIGURACOES.path}
              element={<ROUTES.CONFIGURACOES.component />}
            />
          </Route>

          {/* Rota de redefinir senha (pública) */}
          <Route
            path={ROUTES.REDEFINIRSENHA.path}
            element={<ROUTES.REDEFINIRSENHA.component />}
          />
          <Route
            path={ROUTES.CADASTRO.path}
            element={<ROUTES.CADASTRO.component />}
          />

          {/* Rota 404 */}
          <Route path="*" element={<div>Página em Construção</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
