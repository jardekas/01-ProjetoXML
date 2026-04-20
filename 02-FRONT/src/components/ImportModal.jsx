import { useState, useRef } from "react";
import PropTypes from "prop-types";
import api from "../services/api";

export default function ImportModal({ isOpen, onClose }) {
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
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
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-container"
        style={{ width: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Importar XMLs</h2>
            <p className="modal-desc">
              Arraste ou selecione arquivos XML fiscais
            </p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
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

        <div
          className="import-dropzone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          <div className="import-dropzone-icon">
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
          <p className="upload-title">
            {arquivos.length > 0
              ? `${arquivos.length} arquivo(s) selecionado(s)`
              : "Arraste arquivos aqui"}
          </p>
          <p className="upload-hint">
            ou clique para selecionar — NFe, NFCe, CTe, NFSe...
          </p>
          <span className="upload-select-btn">Selecionar arquivos</span>
        </div>

        {arquivos.length > 0 && (
          <div className="import-file-list">
            {arquivos.map((f, i) => (
              <div key={i} className="import-file-item">
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

        {resultado && (
          <div style={{ marginTop: 12 }}>
            {resultado.sucesso > 0 && (
              <div className="import-result-success">
                ✓ {resultado.sucesso} arquivo(s) importado(s) com sucesso
              </div>
            )}
            {resultado.erro.map((e, i) => (
              <div key={i} className="import-result-error">
                ✗ {e.nome}: {e.msg}
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleImportar}
            disabled={loading || arquivos.length === 0}
            style={{ flex: 2 }}
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
