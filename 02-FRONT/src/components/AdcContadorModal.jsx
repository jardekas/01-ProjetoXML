import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../services/api";
import { maskCNPJ, maskCPF } from "../utils/mask";

export default function AdcContadorModal({ isOpen, onClose, onSaved }) {
  const [contadores, setContadores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [contadorSelecionado, setContadorSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setErro("");
    setContadorSelecionado(null);
    setEmpresaSelecionada(null);

    Promise.all([api.get("/contador/lista"), api.get("/document/empresas")])
      .then(([resContadores, resEmpresas]) => {
        console.log("Contadores:", resContadores.data);
        console.log("Empresas:", resEmpresas.data);

        setContadores(resContadores.data);
        setEmpresas(resEmpresas.data);

        if (resEmpresas.data.length === 1) {
          setEmpresaSelecionada(resEmpresas.data[0]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setErro("Erro ao carregar dados. Tente novamente.");
        }
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSalvar = async () => {
    if (!contadorSelecionado) {
      setErro("Selecione um contador");
      return;
    }
    if (!empresaSelecionada) {
      setErro("Selecione uma empresa");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      await api.post(`/contador/${contadorSelecionado.idContador}/vinculos`, {
        cnpj: empresaSelecionada.EMPcpfCNPJ,
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-container--adc-contador"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Vincular Contador</h2>
            <p className="modal-desc">
              Selecione um contador e a empresa a ser vinculada
            </p>
          </div>
          <button className="action-btn" onClick={onClose}>
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

        {/* Seletor de Empresa */}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Empresa</label>
          <div className="select-wrapper">
            <select
              className="select-f"
              value={empresaSelecionada?.EMPcpfCNPJ || ""}
              onChange={(e) => {
                const selected = empresas.find(
                  (emp) => emp.EMPcpfCNPJ === e.target.value,
                );
                setEmpresaSelecionada(selected);
              }}
              disabled={loading || empresas.length === 0}
            >
              <option value="">Selecione uma empresa...</option>
              {empresas.map((emp) => (
                <option key={emp.EMPcpfCNPJ} value={emp.EMPcpfCNPJ}>
                  {emp.nomeEmp} ({maskCNPJ(emp.EMPcpfCNPJ)})
                </option>
              ))}
            </select>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {empresas.length === 0 && !loading && (
            <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>
              Nenhuma empresa encontrada.
            </div>
          )}
        </div>

        {/* Lista de Contadores */}
        <div className="contador-list">
          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
              Carregando...
            </div>
          ) : contadores.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
              Nenhum contador cadastrado
            </div>
          ) : (
            contadores.map((c) => {
              const isSelected = contadorSelecionado?.id === c.id;
              return (
                <label
                  key={c.id}
                  className={`contador-item ${isSelected ? "contador-item--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="contador"
                    checked={isSelected}
                    onChange={() => setContadorSelecionado(c)}
                    className="contador-radio"
                  />
                  <div className="contador-avatar">
                    {c.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="contador-info">
                    <div className="contador-name">{c.name}</div>
                    <div className="contador-email">{c.email}</div>
                    <div className="contador-cpf">CPF: {maskCPF(c.cpf)}</div>
                  </div>
                  {isSelected && (
                    <svg
                      className="contador-check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
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

        {erro && <div className="error-message">{erro}</div>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleSalvar}
            disabled={salvando || !contadorSelecionado || !empresaSelecionada}
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
  onSaved: PropTypes.func.isRequired,
};
