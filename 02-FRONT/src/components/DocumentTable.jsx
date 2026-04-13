import api from "../services/api";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  TIPO_COLORS,
  STATUS_STYLE,
  formatCurrency,
} from "../services/documentServices";
import { abrirDanfe } from "../utils/danfeUtils";

const SortIcon = ({ col, sortCol, sortDir }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke={sortCol === col ? "#1d4ed8" : "#94a3b8"}
    strokeWidth="2.5"
  >
    <path
      d="M7 3L12 8L17 3"
      opacity={sortCol === col && sortDir === "desc" ? 1 : 0.4}
    />
    <path
      d="M7 21L12 16L17 21"
      opacity={sortCol === col && sortDir === "asc" ? 1 : 0.4}
    />
  </svg>
);

SortIcon.propTypes = {
  col: PropTypes.string.isRequired,
  sortCol: PropTypes.string,
  sortDir: PropTypes.string,
};

function DocumentTable({
  documentos,
  selected,
  onToggleSelect,
  onToggleAll,
  sortCol,
  sortDir,
  onSort,
  user,
  verTodos,
  setVerTodos,
  onRefresh,
}) {
  const [hoverRow, setHoverRow] = useState(null);
  const [loadingXml, setLoadingXml] = useState(false);

  const handleVisualizar = async (doc) => {
    setLoadingXml(true);
    try {
      const response = await api.get(`/document/visualizar/${doc.id}`);
      await abrirDanfe(response.data.xml);
    } catch (error) {
      alert("Erro ao carregar XML: " + error.message);
    } finally {
      setLoadingXml(false);
    }
  };

  const handleDownloadSelecionados = async () => {
    if (!selected.length) return;
    try {
      const ids = selected.join(",");
      const response = await api.get(
        `/document/${user.id}/${user.EMPcpfCNPJ}/download?id=${ids}`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `xmls_selecionados.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      await api.patch("/document/baixado", { ids: selected });
      onRefresh();
    } catch (err) {
      alert(`Erro: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDownload = async (docId) => {
    try {
      const response = await api.get(
        `/document/${user.id}/${user.EMPcpfCNPJ}/download?id=${docId}`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `xml_${docId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      await api.patch("/document/baixado", { ids: [docId] });
      onRefresh();
    } catch (err) {
      alert(`Erro: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Cabeçalho da tabela */}
      <div
        style={{
          padding: "18px 24px 16px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            Documentos Encontrados
          </span>
          <span
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 20,
              padding: "2px 10px",
            }}
          >
            {documentos.length}
          </span>
        </div>
        <div>
          <label className="remember-label-simple">
            <input
              type="checkbox"
              checked={verTodos}
              onChange={(e) => setVerTodos(e.target.checked)}
              className="native-checkbox"
            />
            <span style={{ color: "#0f172a" }}>Todos os documentos</span>
          </label>
        </div>

        {selected.length > 0 && (
          <div
            style={{
              background: "#1e293b",
              color: "white",
              borderRadius: 12,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              animation: "slideIn 0.25s ease",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              {selected.length} selecionado{selected.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={handleDownloadSelecionados}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "white",
                borderRadius: 7,
                padding: "6px 12px",
                fontSize: 12.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Baixar todos
            </button>
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px 16px 12px 24px", width: 44 }}>
                <input
                  type="checkbox"
                  checked={
                    selected.length === documentos.length &&
                    documentos.length > 0
                  }
                  onChange={onToggleAll}
                  style={{
                    width: 16,
                    height: 16,
                    accentColor: "#1d4ed8",
                    cursor: "pointer",
                  }}
                />
              </th>
              {[
                { label: "Chave NFe", col: "chave" },
                { label: "Documento", col: "numero" },
                { label: "Cliente", col: "cliente" },
                { label: "CNPJ", col: "clienteCNPJ" },
                { label: "Data", col: "data" },
                { label: "Valor", col: "valor" },
                { label: "Status", col: "status" },
              ].map(({ label, col }) => (
                <th
                  key={col}
                  style={{
                    padding: "12px 16px",
                    textAlign: col === "numero" ? "center" : "left",
                  }}
                >
                  <button
                    onClick={() => onSort(col)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#64748b",
                      padding: 0,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}{" "}
                    <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
                  </button>
                </th>
              ))}
              <th
                style={{ padding: "12px 24px 12px 16px", textAlign: "right" }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#64748b",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Ações
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((doc) => {
              const tc = TIPO_COLORS[doc.tipo] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              const sc = STATUS_STYLE[doc.status] || STATUS_STYLE["Cancelada"];
              const isSelected = selected.includes(doc.id);
              const isHover = hoverRow === doc.id;

              return (
                <tr
                  key={doc.id}
                  onMouseEnter={() => setHoverRow(doc.id)}
                  onMouseLeave={() => setHoverRow(null)}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    background: isSelected
                      ? "#eff6ff"
                      : isHover
                        ? "#fafbfc"
                        : "white",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "14px 16px 14px 24px" }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(doc.id)}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: "#1d4ed8",
                        cursor: "pointer",
                      }}
                    />
                  </td>
                  <td style={{ padding: "14px 5px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={sc.dot}
                        strokeWidth="2.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span
                        style={{
                          background: tc.bg,
                          color: tc.text,
                          fontSize: 11,
                          borderRadius: 6,
                          padding: "3px 8px",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {doc.tipo}
                      </span>
                      <span style={{ fontSize: 13, color: "#0f172a" }}>
                        {(doc.chave || "").length > 22
                          ? doc.chave.slice(0, 22) + "..."
                          : doc.chave}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <span style={{ fontSize: 16, color: "#0f172a" }}>
                      {doc.numero}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, color: "#475569" }}>
                      {doc.cliente}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#475569",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {doc.clienteCNPJ || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#475569",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {doc.data}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: "#0f172a",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {formatCurrency(doc.valor)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: sc.bg,
                        color: sc.text,
                        fontSize: 12.5,
                        borderRadius: 20,
                        padding: "4px 12px",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sc.dot,
                          display: "inline-block",
                        }}
                      />
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 24px 14px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        className="action-btn"
                        title="Visualizar DANFE"
                        onClick={() => handleVisualizar(doc)}
                        disabled={loadingXml}
                      >
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
                      </button>
                      <button
                        className="action-btn"
                        title="Baixar XML"
                        onClick={() => handleDownload(doc.id)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {documentos.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    style={{ display: "block", margin: "0 auto 12px" }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    Nenhum documento encontrado
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    Tente ajustar os filtros
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "14px 24px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#64748b" }}>
          Exibindo <strong>{documentos.length}</strong> documentos
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "#1d4ed8",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            1
          </button>
        </div>
      </div>
    </div>
  );
}

DocumentTable.propTypes = {
  documentos: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  sortCol: PropTypes.string,
  sortDir: PropTypes.string,
  onSort: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  verTodos: PropTypes.bool.isRequired,
  setVerTodos: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default DocumentTable;
