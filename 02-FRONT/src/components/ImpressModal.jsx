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

  // Reinicia o estado quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setIframeReady(false);
    }
  }, [isOpen]);

  // Injeta HTML no iframe assim que ele estiver disponível
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const iframe = iframeRef.current;
      const handleLoad = () => setIframeReady(true);

      iframe.addEventListener("load", handleLoad);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Se já estiver carregado, marca como pronto
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

    // Aguarda um ciclo para garantir renderização completa
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          width: "90%",
          maxWidth: 1000,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          animation: "modalIn 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Gerar Relatório PDF
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>
            {documentos.length} documento{documentos.length !== 1 ? "s" : ""} ·{" "}
            {periodoInicio} até {periodoFim}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            backgroundColor: "#f8fafc",
            marginBottom: 16,
          }}
        >
          <iframe
            ref={iframeRef}
            title="preview"
            style={{
              width: "100%",
              height: "100%",
              minHeight: 350,
              border: "none",
              backgroundColor: "white",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={gerando}
            style={{
              padding: "10px 20px",
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
            onClick={handleGerarPDF}
            disabled={gerando || !iframeReady}
            style={{
              padding: "10px 20px",
              background:
                gerando || !iframeReady
                  ? "#93c5fd"
                  : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: gerando || !iframeReady ? "not-allowed" : "pointer",
              color: "white",
            }}
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
