import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { gerarHTMLRelatorio } from "../utils/relatorioUtils";

export default function ImpressModal({
  isOpen,
  onClose,
  documentos,
  userType,
  periodoInicio,
  periodoFim,
}) {
  const [gerando, setGerando] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef(null);

  const html = gerarHTMLRelatorio(
    documentos,
    periodoInicio,
    periodoFim,
    userType,
  );

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) setIframeReady(false);
  }, [isOpen]);

  // Injeta HTML no iframe
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const iframe = iframeRef.current;
      const handleLoad = () => setIframeReady(true);

      iframe.addEventListener("load", handleLoad);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      if (iframeDoc.readyState === "complete") {
        setIframeReady(true);
      }

      return () => iframe.removeEventListener("load", handleLoad);
    }
  }, [isOpen, html]);

  // Impressão nativa (igual preview)
  const handleGerarPDF = () => {
    if (!iframeRef.current || !iframeReady) return;

    setGerando(true);

    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;

    iframeWindow.focus();
    iframeWindow.print();

    // pequena espera só pra UX
    setTimeout(() => setGerando(false), 800);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-container--impress"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header modal-header--impress">
          <div style={{ width: "100%" }}>
            <h2 className="modal-title">Gerar Relatório PDF</h2>
            <p className="modal-desc">
              {documentos.length} documento
              {documentos.length !== 1 ? "s" : ""} · {periodoInicio} até{" "}
              {periodoFim}
            </p>
          </div>
        </div>

        <div className="impress-preview-container">
          <iframe
            ref={iframeRef}
            title="preview"
            className="impress-preview-iframe"
          />
        </div>

        <div className="modal-actions modal-actions--end">
          <button className="btn-cancel" onClick={onClose} disabled={gerando}>
            Cancelar
          </button>

          <button
            className="btn-primary btn-primary--small"
            onClick={handleGerarPDF}
            disabled={!iframeReady || gerando}
          >
            {gerando ? "Abrindo impressão..." : "Imprimir / Salvar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

ImpressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  documentos: PropTypes.array.isRequired,
  userType: PropTypes.string.isRequired,
  periodoInicio: PropTypes.string.isRequired,
  periodoFim: PropTypes.string.isRequired,
};
