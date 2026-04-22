import api from "../services/api";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  TIPO_COLORS,
  STATUS_STYLE,
  formatCurrency,
} from "../services/documentServices";

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
  onRefresh,
}) {
  const [hoverRow, setHoverRow] = useState(null);
  const [loadingXml, setLoadingXml] = useState(false);

  const handleVisualizar = async (doc) => {
    setLoadingXml(true);
    try {
      const response = await api.get(`/document/visualizar/${doc.id}`);
      const xml = response.data.xml;

      const pdfResponse = await api.post(
        "/api/danfe/gerar",
        { xml },
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(
        new Blob([pdfResponse.data], { type: "application/pdf" }),
      );
      window.open(url, "_blank");
    } catch (error) {
      alert(
        "Erro ao gerar DANFE: " +
          (error.response?.data?.error || error.message),
      );
    } finally {
      setLoadingXml(false);
    }
  };

  const handleDownloadSelecionados = async () => {
    if (!selected.length) return;
    try {
      const ids = selected.join(",");
      const primeiroDoc = documentos.find((doc) => doc.id === selected[0]);
      const docCnpj = primeiroDoc?.EMPcpfCNPJ;
      const cnpjParaDownload =
        user.flg_conta || user.flg_master ? docCnpj : user.EMPcpfCNPJ;
      const token = localStorage.getItem("token");

      if (!cnpjParaDownload) {
        alert("CNPJ para download não disponível.");
        return;
      }

      const response = await api.get(
        `/document/${cnpjParaDownload}/download?id=${ids}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        },
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

  const handleDownload = async (docId, docCnpj) => {
    try {
      const token = localStorage.getItem("token");
      const cnpjParaDownload =
        user.flg_conta || user.flg_master ? docCnpj : user.EMPcpfCNPJ;
      const response = await api.get(
        `/document/${cnpjParaDownload}/download?id=${docId}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        },
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
    <div className="doc-table-wrapper">
      {/* Cabeçalho da tabela */}
      <div className="doc-table-header">
        <div className="doc-table-title">
          <span>Documentos Encontrados</span>
          <span className="doc-table-badge">{documentos.length}</span>
        </div>

        {selected.length > 0 && (
          <div className="doc-table-selected-bar">
            <span className="doc-table-selected-text">
              {selected.length} selecionado{selected.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={handleDownloadSelecionados}
              className="doc-table-download-btn"
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
        <table className="doc-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="doc-table-checkbox"
                  checked={
                    selected.length === documentos.length &&
                    documentos.length > 0
                  }
                  onChange={onToggleAll}
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
                  data-align={col === "numero" ? "center" : undefined}
                >
                  <button
                    onClick={() => onSort(col)}
                    className="doc-table-sort-btn"
                  >
                    {label}{" "}
                    <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
                  </button>
                </th>
              ))}
              <th>Ações</th>
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
                  className={`${isSelected ? "row-selected" : ""} ${
                    isHover ? "row-hover" : ""
                  }`}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="doc-table-checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(doc.id)}
                    />
                  </td>
                  <td>
                    <div className="doc-table-chave-cell">
                      <div className="doc-table-chave-header">
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
                          className="doc-type-badge"
                          style={{ background: tc.bg, color: tc.text }}
                        >
                          {doc.tipo}
                        </span>
                      </div>
                      <span className="doc-table-chave-text">{doc.chave}</span>
                    </div>
                  </td>
                  <td className="doc-table-numero-cell">{doc.numero}</td>
                  <td className="doc-table-mono">{doc.cliente}</td>
                  <td className="doc-table-mono">{doc.clienteCNPJ || "—"}</td>
                  <td className="doc-table-mono">{doc.data}</td>
                  <td className="doc-table-mono">
                    {formatCurrency(doc.valor)}
                  </td>
                  <td>
                    <span
                      className="doc-status-badge"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      <span
                        className="doc-status-dot"
                        style={{ background: sc.dot }}
                      />
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <div className="doc-table-actions">
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
                        onClick={() => handleDownload(doc.id, doc.EMPcpfCNPJ)}
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
                <td colSpan={9} className="doc-table-empty">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <div className="doc-table-empty-title">
                    Nenhum documento encontrado
                  </div>
                  <div className="doc-table-empty-sub">
                    Tente ajustar os filtros
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="doc-table-footer">
        <span className="doc-table-footer-info">
          Exibindo <strong>{documentos.length}</strong> documentos
        </span>
        <div className="doc-table-footer-pagination">
          <button className="doc-table-page-btn">1</button>
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
  onRefresh: PropTypes.func.isRequired,
};

export default DocumentTable;
