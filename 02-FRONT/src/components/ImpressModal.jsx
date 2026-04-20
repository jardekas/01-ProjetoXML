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

  useEffect(() => {
    if (isOpen) {
      setIframeReady(false);
    }
  }, [isOpen]);

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

  const handleGerarPDF = async () => {
    if (!iframeRef.current || !iframeReady) {
      alert("Aguarde o carregamento da pré-visualização.");
      return;
    }

    setGerando(true);

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    await new Promise((resolve) => setTimeout(resolve, 100));

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);

    script.onload = () => {
      const nomeArquivo =
        `relatorio_${periodoInicio}_${periodoFim}.pdf`.replace(/\//g, "-");

      const opt = {
        margin: [10, 10, 10, 10],
        filename: nomeArquivo,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["css", "legacy"] },
      };

      window
        .html2pdf()
        .set(opt)
        .from(iframeDoc.body)
        .save()
        .then(() => {
          document.head.removeChild(script);
          setGerando(false);
          onClose();
        })
        .catch((err) => {
          console.error("Erro ao gerar PDF:", err);
          alert("Erro ao gerar PDF.");
          document.head.removeChild(script);
          setGerando(false);
        });
    };

    script.onerror = () => {
      alert("Erro ao carregar biblioteca de PDF.");
      document.head.removeChild(script);
      setGerando(false);
    };
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
              {documentos.length} documento{documentos.length !== 1 ? "s" : ""}{" "}
              · {periodoInicio} até {periodoFim}
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
            disabled={gerando || !iframeReady}
          >
            {gerando ? "Gerando PDF..." : "Baixar PDF"}
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
