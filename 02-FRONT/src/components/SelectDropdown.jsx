import PropTypes from "prop-types";

export default function SelectDropdown({
  id,
  value,
  setValue,
  options,
  placeholder,
  openSelect,
  setOpenSelect,
}) {
  const isOpen = openSelect === id;

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <button
        onClick={() => setOpenSelect(isOpen ? null : id)}
        style={{
          width: "100%",
          background: "white",
          border: `1.5px solid ${isOpen ? "#1d4ed8" : "#e2e8f0"}`,
          borderRadius: 9,
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: "'Outfit',sans-serif",
          color: value ? "#0f172a" : "#94a3b8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          boxShadow: isOpen ? "0 0 0 3px rgba(29,78,216,0.1)" : "none",
          transition: "all 0.2s",
        }}
      >
        <span>{value || placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? "#1d4ed8" : "#94a3b8"}
          strokeWidth="2.5"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "white",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
            animation: "dropIn 0.15s ease",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setValue(opt);
                setOpenSelect(null);
              }}
              style={{
                padding: "10px 14px",
                fontSize: 14,
                cursor: "pointer",
                color: value === opt ? "#1d4ed8" : "#374151",
                background: value === opt ? "#eff6ff" : "transparent",
                fontWeight: value === opt ? 600 : 400,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (value !== opt) e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                if (value !== opt)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

SelectDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
  openSelect: PropTypes.string,
  setOpenSelect: PropTypes.func.isRequired,
};
