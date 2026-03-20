import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingParticle from "../components/FloatingParticle";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);

    try {
      const { user, token } = await authService.login(email, password);
      console.log("user recebido:", user);
      if (rememberMe) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }
      login(user, token || localStorage.getItem("token"));
      navigate("/dashboard");
    } catch (error) {
      setError("Email ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = () => {
    navigate("/redefinir_Senha");
  };

  const handleCadastro = () => {
    navigate("/cadastro");
  };

  return (
    <div className="login-container">
      {/* Animação grid background */}
      <div className="grid-background" />

      {/* Animação bolhas */}
      <div className="glow-orbs">
        <div className="glow-orb orb-top-left" />
        <div className="glow-orb orb-bottom-right" />
      </div>

      <FloatingParticle
        style={{
          width: 8,
          height: 8,
          top: "20%",
          left: "15%",
          animationDelay: "0s",
        }}
      />
      <FloatingParticle
        style={{
          width: 5,
          height: 5,
          top: "60%",
          left: "8%",
          animationDelay: "2s",
        }}
      />
      <FloatingParticle
        style={{
          width: 10,
          height: 10,
          top: "30%",
          right: "12%",
          animationDelay: "1s",
        }}
      />
      <FloatingParticle
        style={{
          width: 6,
          height: 6,
          bottom: "25%",
          right: "20%",
          animationDelay: "3s",
        }}
      />

      {/* Card */}
      <div className={`login-card ${mounted ? "mounted" : ""}`}>
        {/* Logo area */}
        <div className="logo-area">
          <div className="">
            <img
              src="../../public/SgMat_Icon4.ico"
              alt="Portal Contador Logo"
              className="logo-image"
            />
          </div>
          <div>
            <div className="portal-subtitle">Portal Contador</div>
            <div className="portal-title">Gestão Fiscal</div>
          </div>
        </div>

        {/* Card body */}
        <div className="card-body">
          <div className="welcome-area">
            <h1 className="welcome-title">Bem-vindo de volta</h1>
            <p className="welcome-subtitle">
              Entre com suas credenciais de acesso
            </p>
          </div>

          {error && (
            <div className="error-message">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div className="input-wrapper">
                <span
                  className={`input-icon ${focused === "email" ? "focused" : ""}`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="form-input input-with-icon"
                  placeholder="contador@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-wrapper">
                <span
                  className={`input-icon ${focused === "pass" ? "focused" : ""}`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-input input-with-icon input-with-password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar & esqueci senha */}
            <div className="form-options simple">
              <label className="remember-label-simple">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    console.log("Lembrar acesso:", e.target.checked);
                  }}
                  className="native-checkbox"
                />
                <span>Lembrar acesso</span>
              </label>
            </div>
            <div className="form-options">
              <button
                type="button"
                className="link-button"
                onClick={handleForgotPassword}
              >
                Esqueci a senha
              </button>
              <button
                type="button"
                className="Cadastrar-link-button"
                onClick={handleCadastro}
              >
                Fazer Cadastro
              </button>
            </div>
            {/* entrar no portal */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="loading-content">
                  <span className="spinner" />
                  Entrando...
                </span>
              ) : (
                "Entrar no Portal"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Problemas de acesso?{" "}
            <button className="link-button">Contate o suporte</button>
          </p>
          <p className="copyright">
            © {new Date().getFullYear()} Portal Contador · v2.4.1
          </p>
        </div>
      </div>
    </div>
  );
}
