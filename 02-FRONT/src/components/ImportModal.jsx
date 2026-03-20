import { useState, useRef } from "react";
import PropTypes from "prop-types";
import api from "../services/api";

export default function ImportModal({ isOpen, onClose }) {
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null); // { sucesso, erro }
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleFiles = (files) => {
    const xmls = Array.from(files).filter((f) => f.name.endsWith(".xml"));
    setArquivos(xmls);
    setResultado(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleImportar = async () => {
    if (!arquivos.length) return;
    setLoading(true);
    setResultado(null);

    const resultados = { sucesso: 0, erro: [] };

    for (const arquivo of arquivos) {
      const formData = new FormData();
      formData.append("xml", arquivo);

      try {
        await api.post("/document/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resultados.sucesso++;
      } catch (err) {
        resultados.erro.push({
          nome: arquivo.name,
          msg: err.response?.data?.error || "Erro ao importar",
        });
      }
    }

    setResultado(resultados);
    setLoading(false);
    setArquivos([]);

    if (resultados.erro.length === 0) {
      setTimeout(onClose, 1500);
    }
  };

  const handleClose = () => {
    setArquivos([]);
    setResultado(null);
    onClose();
  };

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
      onClick={handleClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: "32px",
          width: 460,
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
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Importar XMLs
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Arraste ou selecione arquivos XML fiscais
            </p>
          </div>
          <button
            onClick={handleClose}
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

        <input
          ref={inputRef}
          type="file"
          accept=".xml"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed #e2e8f0",
            borderRadius: 14,
            padding: "40px 24px",
            textAlign: "center",
            background: "#f8fafc",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            {arquivos.length > 0
              ? `${arquivos.length} arquivo(s) selecionado(s)`
              : "Arraste arquivos aqui"}
          </p>
          <p style={{ margin: "6px 0 14px", fontSize: 13, color: "#64748b" }}>
            ou clique para selecionar — NFe, NFCe, CTe, NFSe...
          </p>
          <span
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: 12.5,
              fontWeight: 600,
              borderRadius: 7,
              padding: "6px 14px",
            }}
          >
            Selecionar arquivos
          </span>
        </div>

        {/* Lista de arquivos */}
        {arquivos.length > 0 && (
          <div style={{ marginTop: 12, maxHeight: 100, overflowY: "auto" }}>
            {arquivos.map((f, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  color: "#475569",
                  padding: "3px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {f.name}
              </div>
            ))}
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div style={{ marginTop: 12 }}>
            {resultado.sucesso > 0 && (
              <div
                style={{
                  color: "#15803d",
                  fontSize: 13,
                  padding: "6px 10px",
                  background: "#dcfce7",
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              >
                ✓ {resultado.sucesso} arquivo(s) importado(s) com sucesso
              </div>
            )}
            {resultado.erro.map((e, i) => (
              <div
                key={i}
                style={{
                  color: "#b91c1c",
                  fontSize: 12,
                  padding: "4px 10px",
                  background: "#fee2e2",
                  borderRadius: 8,
                  marginBottom: 4,
                }}
              >
                ✗ {e.nome}: {e.msg}
              </div>
            ))}
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: "12px",
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
            onClick={handleImportar}
            disabled={loading || arquivos.length === 0}
            style={{
              flex: 2,
              padding: "12px",
              background:
                loading || arquivos.length === 0
                  ? "#93c5fd"
                  : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: arquivos.length === 0 ? "not-allowed" : "pointer",
              color: "white",
            }}
          >
            {loading
              ? "Importando..."
              : `Importar ${arquivos.length > 0 ? `(${arquivos.length})` : "XMLs"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

ImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
