import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../services/api";
import { maskCNPJ, maskCPF } from "../utils/mask";

export default function AdcContadorModal({ isOpen, onClose, user, onSaved }) {
  const [contadores, setContadores] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setErro("");
    setSelecionado(null);
    api
      .get("/contador/lista")
      .then((res) => setContadores(res.data))
      .catch(() => setErro("Erro ao carregar contadores"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSalvar = async () => {
    if (!selecionado) {
      setErro("Selecione um contador");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await api.post(`/contador/${selecionado.idContador}/vinculos`, {
        cnpj: user.EMPcpfCNPJ,
      });
      onSaved();
      onClose();
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao vincular contador");
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 32,
          width: 540,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          animation: "modalIn 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Adicionar Contador
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Selecione um contador para vincular à sua empresa
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 7,
              borderRadius: 8,
              color: "#64748b",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Info empresa */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600 }}>
            Empresa:{" "}
          </span>
          <span
            style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {maskCNPJ(user?.EMPcpfCNPJ || "")}
          </span>
        </div>

        {/* Lista de contadores */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
              Carregando contadores...
            </div>
          ) : contadores.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
              Nenhum contador cadastrado
            </div>
          ) : (
            contadores.map((c) => {
              const isSelected = selecionado?.id === c.id;
              return (
                <label
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: isSelected ? "#eff6ff" : "#f8fafc",
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? "#1d4ed8" : "#e2e8f0"}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="radio"
                    name="contador"
                    checked={isSelected}
                    onChange={() => setSelecionado(c)}
                    style={{
                      accentColor: "#1d4ed8",
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {c.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}
                    >
                      {c.email}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "#94a3b8",
                        fontFamily: "'JetBrains Mono', monospace",
                        marginTop: 1,
                      }}
                    >
                      CPF: {maskCPF(c.cpf)}
                    </div>
                  </div>
                  {isSelected && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1d4ed8"
                      strokeWidth="2.5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                </label>
              );
            })
          )}
        </div>

        {erro && (
          <div
            style={{
              color: "#dc2626",
              fontSize: 13,
              padding: "8px 12px",
              background: "#fef2f2",
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            {erro}
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              color: "#475569",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando || !selecionado}
            style={{
              flex: 2,
              padding: 12,
              background: !selecionado
                ? "#93c5fd"
                : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: !selecionado ? "not-allowed" : "pointer",
              color: "white",
            }}
          >
            {salvando ? "Vinculando..." : "Vincular Contador"}
          </button>
        </div>
      </div>
    </div>
  );
}

AdcContadorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
};
