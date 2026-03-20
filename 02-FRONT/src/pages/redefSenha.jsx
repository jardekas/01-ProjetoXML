import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/redefSenha.css";

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Estrutura para recuperação de senha
    setMessage("Instruções enviadas para seu e-mail!");
    setTimeout(() => navigate("/"), 3000);
  };

  return (
    <div className="redefinir-container">
      <div className="redefinir-card">
        <h2 className="redefinir-title">Redefinir Senha</h2>

        {message ? (
          <p className="success-message">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="redefinir-form">
            <p className="redefinir-text">
              Digite seu e-mail para receber instruções de recuperação
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="redefinir-input"
            />

            <button type="submit" className="redefinir-button">
              Enviar instruções
            </button>
          </form>
        )}

        <button onClick={() => navigate("/")} className="voltar-button">
          Voltar para o login
        </button>
      </div>
    </div>
  );
}
