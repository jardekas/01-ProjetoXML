import PropTypes from "prop-types";

export default function TemaSelector({
  temas,
  temaAtivo,
  onSelect,
  hoverTema,
  setHoverTema,
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Tema de Cores
      </div>
      {temas.map((t) => (
        <div
          key={t.id}
          className={`tema-row${temaAtivo === t.id ? " active" : ""}`}
          onMouseEnter={() => setHoverTema(t.id)}
          onMouseLeave={() => setHoverTema(null)}
          onClick={() => onSelect(t.id)}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {t.cores.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: temaAtivo === t.id ? "#1d4ed8" : "#374151",
              flex: 1,
            }}
          >
            {t.label}
          </span>
          {temaAtivo === t.id && (
            <span
              style={{
                background: "#1d4ed8",
                color: "white",
                fontSize: 11.5,
                fontWeight: 700,
                borderRadius: 20,
                padding: "3px 12px",
                letterSpacing: "0.03em",
              }}
            >
              Ativo
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

TemaSelector.propTypes = {
  temas: PropTypes.array.isRequired,
  temaAtivo: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  hoverTema: PropTypes.string,
  setHoverTema: PropTypes.func.isRequired,
};
