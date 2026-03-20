import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

/* tempo de sessão em milissegundos (30 minutos).
para mudar o tempo precisa alterar o primeiro valor.*/

const TEMPO_SESSAO = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const timerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("sessao_expiracao");
    setUser(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.setItem("sessao_expiracao", Date.now() + TEMPO_SESSAO);
    timerRef.current = setTimeout(() => {
      logout();
      alert("Sessão expirada. Faça login novamente.");
    }, TEMPO_SESSAO);
  }, [logout]);

  const login = useCallback(
    (userData, token) => {
      console.log("salvando user:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      resetTimer();
    },
    [resetTimer],
  );

  // Monitora interações do usuário
  useEffect(() => {
    if (!user) return;

    const eventos = ["mousemove", "keydown", "click", "scroll"];
    eventos.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      eventos.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);

  // Verifica sessão expirada ao recarregar
  useEffect(() => {
    if (!user) return;
    const expiracao = localStorage.getItem("sessao_expiracao");
    if (expiracao && Date.now() > Number(expiracao)) {
      logout();
    }
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
