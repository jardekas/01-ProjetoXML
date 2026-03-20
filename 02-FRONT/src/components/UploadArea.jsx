import PropTypes from "prop-types";

export default function UploadArea({ file, onFileChange, onFileRemove }) {
  return (
    <div>
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Logo do Escritório
      </div>
      <label style={{ cursor: "pointer" }}>
        <div className="upload-area">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {file ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
              {file ? (
                file.name
              ) : (
                <>
                  <span style={{ fontWeight: 700, color: "#1d4ed8" }}>
                    Escolher arquivo
                  </span>
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                    {" "}
                    Nenhum arquivo escolhido
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              Formatos aceitos: JPG, PNG, SVG (máx. 2MB)
            </div>
          </div>
        </div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.svg"
          style={{ display: "none" }}
          onChange={(e) => onFileChange(e.target.files[0] || null)}
        />
      </label>
      {file && (
        <button
          onClick={onFileRemove}
          style={{
            marginTop: 10,
            background: "none",
            border: "none",
            color: "#ef4444",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: 0,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Remover arquivo
        </button>
      )}
    </div>
  );
}

UploadArea.propTypes = {
  file: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
  onFileRemove: PropTypes.func.isRequired,
};
