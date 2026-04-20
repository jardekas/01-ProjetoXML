import PropTypes from "prop-types";
import { PERMISSOES } from "../services/usuariosService";
import { maskCPF, maskCNPJ, maskPhone } from "../utils/mask";

export default function UserModal({
  modal,
  form,
  setForm,
  onClose,
  onSave,
  onConfirmDelete,
  isContadorDelete = false,
  podecriarContador = false,
  podecriarMaster = false,
  podecriarEmpresa = false,
}) {
  const tiposDisponiveis = [
    ...(podecriarEmpresa ? ["Empresa"] : []),
    ...(podecriarContador ? ["Contador"] : []),
    ...(podecriarMaster ? ["Master"] : []),
  ];

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

  const formFields = [
    {
      label: "Nome completo*",
      key: "nome",
      placeholder: "Ex: Maria Santos",
      mask: null,
    },
    { label: "CPF*", key: "cpf", placeholder: "000.000.000-00", mask: maskCPF },
    {
      label: "CNPJ*",
      key: "cnpj",
      placeholder: "00.000.000/0000-00",
      mask: maskCNPJ,
    },
    {
      label: "E-mail*",
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
      ? [{ label: "CRC", key: "crc", placeholder: "0SP000000/O-0", mask: null }]
      : []),
    {
      label: "Senha*",
      key: "senha",
      placeholder: "Mínimo 6 caracteres",
      mask: null,
      type: "password",
    },
    {
      label: "Confirmar Senha*",
      key: "confirmarSenha",
      placeholder: "Repita a senha",
      mask: null,
      type: "password",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${modal === "delete" ? "modal-container--delete" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* NEW / EDIT */}
        {(modal === "new" || modal === "edit") && (
          <>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-desc">{desc}</p>
              </div>
              <button className="action-btn" onClick={onClose}>
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

            <div className="form-group">
              {formFields.map(({ label, key, placeholder, mask, type }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
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

              <div className="grid-2cols">
                {/* Admin Checkbox */}
                <div>
                  <label className="form-label">Permissões especiais</label>
                  <div className="checkbox-group">
                    <label
                      className="remember-label-simple"
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={form.flg_admin || false}
                        onChange={(e) =>
                          handleFormChange("flg_admin", e.target.checked)
                        }
                        className="native-checkbox"
                      />
                      <span
                        style={{ color: "var(--text-primary)", fontSize: 14 }}
                      >
                        Administrador
                      </span>
                    </label>
                  </div>
                </div>

                {/* Tipo */}
                <div>
                  <label className="form-label">Tipo</label>
                  <div className="select-wrapper">
                    <select
                      className="select-f"
                      value={form.tipo}
                      onChange={(e) => handleFormChange("tipo", e.target.value)}
                    >
                      {tiposDisponiveis.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <svg
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
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 24 }}>
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

        {/* DELETE */}
        {modal === "delete" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                className={`delete-icon-box ${isContadorDelete ? "delete-icon-box--warning" : "delete-icon-box--danger"}`}
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
              <h2 className="delete-title">
                {isContadorDelete ? "Desvincular Contador" : "Excluir Usuário"}
              </h2>
              <p className="delete-description">
                {isContadorDelete
                  ? "O contador será desvinculado desta empresa. Ele não será excluído do sistema."
                  : "Esta ação não pode ser desfeita"}
              </p>
            </div>
            <div className="modal-actions" style={{ marginTop: 0 }}>
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

        {/* PERMISSIONS */}
        {modal === "perms" && (
          <>
            <div className="modal-header" style={{ marginBottom: 22 }}>
              <div>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-desc">{desc}</p>
              </div>
              <button className="action-btn" onClick={onClose}>
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
                <label key={id} className="perms-item">
                  <div className="perms-item-left">
                    <div className="perms-item-title">{label}</div>
                    <div className="perms-item-desc">{desc}</div>
                  </div>
                  <div
                    className={`perms-toggle ${i < 3 ? "perms-toggle--active" : ""}`}
                  >
                    <div
                      className={`perms-toggle-knob ${i < 3 ? "perms-toggle-knob--active" : "perms-toggle-knob--inactive"}`}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: 22 }}>
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
  podecriarContador: PropTypes.bool,
  podecriarEmpresa: PropTypes.bool,
  podecriarMaster: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
};
