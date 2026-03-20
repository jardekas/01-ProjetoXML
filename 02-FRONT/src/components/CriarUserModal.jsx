import PropTypes from "prop-types";
import { EMPTY_USER, PERMISSOES } from "../services/usuariosService";
import { maskCPF, maskCNPJ, maskPhone } from "../utils/mask";

export default function UserModal({
  modal,
  form,
  setForm,
  editId,
  onClose,
  onSave,
  onConfirmDelete,
  isContadorDelete = false,
}) {
  const handleFormChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  if (!modal) return null;

  const getModalTitle = () => {
    if (modal === "new")
      return {
        title: "Novo Usuário",
        desc: "Preencha os dados do novo usuário",
      };
    if (modal === "edit")
      return { title: "Editar Usuário", desc: "Atualize os dados do usuário" };
    if (modal === "delete")
      return {
        title: "Excluir Usuário",
        desc: "Esta ação não pode ser desfeita",
      };
    if (modal === "perms")
      return { title: "Permissões", desc: "Configure o acesso do usuário" };
    return { title: "", desc: "" };
  };

  const { title, desc } = getModalTitle();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: "32px",
          width: modal === "delete" ? 420 : 500,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          animation: "modalIn 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* New / Edit */}
        {(modal === "new" || modal === "edit") && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {title}
                </h2>
                <p
                  style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}
                >
                  {desc}
                </p>
              </div>
              <button onClick={onClose} className="action-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  label: "Nome completo",
                  key: "nome",
                  placeholder: "Ex: Maria Santos",
                  mask: null,
                },
                {
                  label: "CPF",
                  key: "cpf",
                  placeholder: "000.000.000-00",
                  mask: maskCPF,
                },
                {
                  label: "CNPJ",
                  key: "cnpj",
                  placeholder: "00.000.000/0000-00",
                  mask: maskCNPJ,
                },
                {
                  label: "E-mail",
                  key: "email",
                  placeholder: "usuario@empresa.com",
                  mask: null,
                },
                {
                  label: "Telefone",
                  key: "telefone",
                  placeholder: "(00) 00000-0000",
                  mask: maskPhone,
                },
                ...(form.tipo === "Contador"
                  ? [
                      {
                        label: "CRC",
                        key: "crc",
                        placeholder: "0SP000000/O-0",
                        mask: null,
                      },
                    ]
                  : []),
                {
                  label: "Senha",
                  key: "senha",
                  placeholder: "Mínimo 6 caracteres",
                  mask: null,
                  type: "password",
                },
                {
                  label: "Confirmar Senha",
                  key: "confirmarSenha",
                  placeholder: "Repita a senha",
                  mask: null,
                  type: "password",
                },
              ].map(({ label, key, placeholder, mask, type }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#64748b",
                      marginBottom: 7,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    className="input-f"
                    type={type || "text"}
                    placeholder={placeholder}
                    value={form[key] || ""}
                    onChange={(e) => {
                      const val = mask ? mask(e.target.value) : e.target.value;
                      handleFormChange(key, val);
                    }}
                  />
                </div>
              ))}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                {[
                  { label: "Tipo", key: "tipo", opts: ["Empresa", "Contador"] },
                ].map(({ label, key, opts }) => (
                  <div key={key}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#64748b",
                        marginBottom: 7,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="select-f"
                        value={form[key]}
                        onChange={(e) => handleFormChange(key, e.target.value)}
                      >
                        {opts.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                      <svg
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={onSave}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                {modal === "new" ? "Criar Usuário" : "Salvar Alterações"}
              </button>
            </div>
          </>
        )}

        {/* Delete */}
        {modal === "delete" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: isContadorDelete ? "#fef3c7" : "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                {isContadorDelete ? (
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                ) : (
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                )}
              </div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {isContadorDelete ? "Desvincular Contador" : "Excluir Usuário"}
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                {isContadorDelete
                  ? "O contador será desvinculado desta empresa. Ele não será excluído do sistema."
                  : "Esta ação não pode ser desfeita"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="btn-danger"
                style={{ flex: 1 }}
                onClick={onConfirmDelete}
              >
                {isContadorDelete ? "Sim, desvincular" : "Sim, excluir"}
              </button>
            </div>
          </>
        )}

        {/* Permissions */}
        {modal === "perms" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  {title}
                </h2>
                <p
                  style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}
                >
                  {desc}
                </p>
              </div>
              <button onClick={onClose} className="action-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PERMISSOES.map(({ id, label, desc }, i) => (
                <label
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f8fafc",
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: "pointer",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 2 }}
                    >
                      {desc}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: i < 3 ? "#1d4ed8" : "#e2e8f0",
                      position: "relative",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "white",
                        position: "absolute",
                        top: 3,
                        left: i < 3 ? 23 : 3,
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Salvar Permissões
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

UserModal.propTypes = {
  modal: PropTypes.string,
  form: PropTypes.object,
  setForm: PropTypes.func,
  editId: PropTypes.number,
  isContadorDelete: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
};
