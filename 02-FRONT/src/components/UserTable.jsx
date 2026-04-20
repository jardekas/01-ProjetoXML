import PropTypes from "prop-types";
import { TIPO_STYLES } from "../services/usuariosService";
import { maskCPF, maskCNPJ } from "../utils/mask";

export default function UserTable({
  users,
  currentUserId,
  hoverRow,
  setHoverRow,
  onEdit,
  onDelete,
  onPermissions,
}) {
  const getInitials = (nome) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  const getAvatarBg = (tipo) => {
    return tipo === "Admin"
      ? "linear-gradient(135deg,#dc2626,#f87171)"
      : tipo === "Contador"
        ? "linear-gradient(135deg,#f59e0b,#fbbf24)"
        : "linear-gradient(135deg,#1d4ed8,#60a5fa)";
  };

  return (
    <table className="user-table">
      <thead>
        <tr>
          {[
            "Nome",
            "CPF",
            "CNPJ",
            "E-mail",
            "Tipo",
            "Data Criação",
            "Ações",
          ].map((h) => (
            <th key={h} style={{ textAlign: h === "Ações" ? "right" : "left" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => {
          const initials = getInitials(u.nome);
          const avatarBg = getAvatarBg(u.tipo);
          const ts = TIPO_STYLES[u.tipo] || TIPO_STYLES["Usuário"];

          return (
            <tr
              key={u.id}
              onMouseEnter={() => setHoverRow(u.id)}
              onMouseLeave={() => setHoverRow(null)}
              className={hoverRow === u.id ? "user-row-hover" : ""}
              style={{ animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}
            >
              <td>
                <div className="user-cell-name">
                  <div className="avatar" style={{ background: avatarBg }}>
                    {initials}
                  </div>
                  <span className="user-name">{u.nome}</span>
                </div>
              </td>

              <td>
                <span className="user-cell-mono">{maskCPF(u.cpf)}</span>
              </td>

              <td>
                <span className="user-cell-email">{maskCNPJ(u.cnpj)}</span>
              </td>

              <td>
                <span className="user-cell-email">{u.email}</span>
              </td>

              <td>
                <span
                  className="user-type-badge"
                  style={{ background: ts.bg, color: ts.text }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                  {u.tipo}
                </span>
              </td>

              <td>
                <span className="user-cell-mono">{u.criacao}</span>
              </td>

              <td>
                <div className="user-actions">
                  {u.tipo !== "Contador" && (
                    <>
                      <button
                        className="action-btn"
                        title="Permissões"
                        onClick={() => onPermissions(u.id)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </button>
                      <button
                        className="action-btn"
                        title="Editar"
                        onClick={() => onEdit(u)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn danger"
                    disabled={u.id === currentUserId}
                    title={u.tipo === "Contador" ? "Desvincular" : "Excluir"}
                    onClick={() => onDelete(u.id, u.tipo === "Contador")}
                    style={{
                      opacity: u.id === currentUserId ? 0.4 : 1,
                      cursor:
                        u.id === currentUserId ? "not-allowed" : "pointer",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          );
        })}

        {users.length === 0 && (
          <tr>
            <td colSpan={7} className="user-empty-state">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                className="user-empty-icon"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <div style={{ fontWeight: 500 }}>Nenhum usuário encontrado</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  hoverRow: PropTypes.number,
  setHoverRow: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPermissions: PropTypes.func.isRequired,
  currentUserId: PropTypes.number,
};
