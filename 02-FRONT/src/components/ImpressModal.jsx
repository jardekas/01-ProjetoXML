import { useState } from "react";
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

  const handleGerarPDF = async () => {
    if (!documentos || documentos.length === 0) {
      alert("Nenhum documento para gerar relatório.");
      onClose();
      return;
    }

    setGerando(true);

    const html = gerarHTMLRelatorio(
      documentos,
      periodoInicio,
      periodoFim,
      userType,
    );

    // Container temporário fora da tela
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.cssText =
      "position:absolute;left:-9999px;top:0;width:794px;";
    document.body.appendChild(container);

    // Carregar html2pdf dinamicamente
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);

    script.onload = () => {
      const nomeArquivo =
        `relatorio_${periodoInicio}_${periodoFim}.pdf`.replace(/\//g, "-");

      window
        .html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: nomeArquivo,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        })
        .from(container)
        .save()
        .then(() => {
          document.body.removeChild(container);
          document.head.removeChild(script);
          setGerando(false);
          onClose();
        });
    };

    script.onerror = () => {
      alert("Erro ao carregar biblioteca de PDF.");
      document.body.removeChild(container);
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
          padding: 28,
          width: 400,
          maxWidth: "90%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          animation: "modalIn 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Gerar Relatório PDF
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            {documentos.length} documento{documentos.length !== 1 ? "s" : ""} ·{" "}
            {periodoInicio} até {periodoFim}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={gerando}
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
            onClick={handleGerarPDF}
            disabled={gerando}
            style={{
              flex: 1,
              padding: "12px",
              background: gerando
                ? "#93c5fd"
                : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: gerando ? "not-allowed" : "pointer",
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
