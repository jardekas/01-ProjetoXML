import PropTypes from "prop-types";

export default function ImpressModal({ isOpen, onClose }) {
  const handlePrint = () => {
    window.print(); // LEMBRAR DE ALTERAR AQUI QUANDO DEFINIREM QUAL E COMO RELATÓRIO VAI SER PARA IMPRIMIR!!!!
    onClose();
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
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 9V3h12v6" />
              <rect x="6" y="15" width="12" height="6" rx="2" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Imprimir Relatório
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Deseja imprimir o relatório de XMLs fiscais?
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
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
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: "12px",
              background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              color: "white",
            }}
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}

ImpressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
