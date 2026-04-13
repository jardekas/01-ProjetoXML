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

  const handleToggle = (e) => {
    e.stopPropagation(); // evita que clique feche imediatamente
    setOpenSelect(isOpen ? null : id);
  };

  const handleOptionClick = (option) => (e) => {
    e.stopPropagation();
    const newValue = typeof option === "object" ? option.value : option;
    setValue(newValue);
    setOpenSelect(null);
  };

  const getDisplayLabel = () => {
    if (!value) return placeholder;
    const selectedOption = options.find((opt) =>
      typeof opt === "object" ? opt.value === value : opt === value,
    );
    if (selectedOption) {
      return typeof selectedOption === "object"
        ? selectedOption.label
        : selectedOption;
    }
    return value;
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          width: "100%",
          background: "white",
          border: `1.5px solid ${isOpen ? "#1d4ed8" : "#e2e8f0"}`,
          borderRadius: 9,
          padding: "9px 12px",
          fontSize: 13.5,
          fontFamily: "'Outfit',sans-serif",
          color: value ? "#0f172a" : "#94a3b8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          boxShadow: isOpen ? "0 0 0 3px rgba(29,78,216,0.1)" : "none",
          transition: "all 0.2s",
          pointerEvents: "auto",
        }}
      >
        <span>{getDisplayLabel()}</span>
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
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const optValue = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            const isSelected = value === optValue;

            return (
              <div
                key={optValue}
                onClick={handleOptionClick(opt)}
                style={{
                  padding: "10px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  color: isSelected ? "#1d4ed8" : "#374151",
                  background: isSelected ? "#eff6ff" : "transparent",
                  fontWeight: isSelected ? 600 : 400,
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

SelectDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }),
    ]),
  ).isRequired,
  placeholder: PropTypes.string.isRequired,
  openSelect: PropTypes.string,
  setOpenSelect: PropTypes.func.isRequired,
};
