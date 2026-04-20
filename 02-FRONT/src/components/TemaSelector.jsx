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
      <div className="tema-selector__header">
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
          <div className="tema-selector__palette">
            {t.cores.map((c, i) => (
              <div
                key={i}
                className="tema-selector__color-dot"
                style={{ background: c }}
              />
            ))}
          </div>
          <span
            className={`tema-selector__label ${
              temaAtivo === t.id ? "tema-selector__label--active" : ""
            }`}
          >
            {t.label}
          </span>
          {temaAtivo === t.id && (
            <span className="tema-selector__badge">Ativo</span>
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
