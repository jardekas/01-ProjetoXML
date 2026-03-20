import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { maskCPF, maskCNPJ, maskPhone } from "../utils/mask";
import "../styles/usuarios.css";

export default function Cadastro() {
  const [cnpjsVinculados, setCnpjsVinculados] = useState([]);
  const [novoCnpj, setNovoCnpj] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cnpj: "",
    email: "",
    telefone: "",
    tipo: "",
    senha: "",
    confirmarSenha: "",
    crc: "",
  });

  const adicionarCnpj = () => {
    const cnpjLimpo = novoCnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      setErro("CNPJ inválido");
      return;
    }
    if (cnpjsVinculados.includes(cnpjLimpo)) {
      setErro("CNPJ já adicionado");
      return;
    }
    setCnpjsVinculados((prev) => [...prev, cnpjLimpo]);
    setNovoCnpj("");
    setErro("");
  };

  const removerCnpj = (cnpj) => {
    setCnpjsVinculados((prev) => prev.filter((c) => c !== cnpj));
  };

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setErro("");
    if (!form.nome || !form.email || !form.cpf || !form.cnpj || !form.senha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { user: novoUser } = await userService.createUser(form);

      // Se for contador e tiver CNPJs, vincula todos
      if (
        form.tipo === "Contador" &&
        cnpjsVinculados.length &&
        novoUser?.idContador
      ) {
        await Promise.all(
          cnpjsVinculados.map((cnpj) =>
            api.post(`/contador/${novoUser.idContador}/vinculos`, { cnpj }),
          ),
        );
      }

      setSucesso(
        `Usuário cadastrado com sucesso! Senha: ${form.senha}` +
          (cnpjsVinculados.length
            ? ` | ${cnpjsVinculados.length} empresa(s) vinculada(s).`
            : ""),
      );
      setForm({
        nome: "",
        cpf: "",
        cnpj: "",
        email: "",
        telefone: "",
        tipo: "Empresa",
        senha: "",
        confirmarSenha: "",
      });
      setCnpjsVinculados([]);
    } catch (error) {
      setErro(error.response?.data?.error || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Nome completo *",
      key: "nome",
      placeholder: "Ex: Maria Santos",
      mask: null,
    },
    {
      label: "CPF *",
      key: "cpf",
      placeholder: "000.000.000-00",
      mask: maskCPF,
    },
    {
      label: "CNPJ *",
      key: "cnpj",
      placeholder: "00.000.000/0000-00",
      mask: maskCNPJ,
    },
    {
      label: "E-mail *",
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
            label: "CRC *",
            key: "crc",
            placeholder: "0SP000000/O-0",
            mask: null,
          },
        ]
      : []),
    {
      label: "Senha *",
      key: "senha",
      placeholder: "Mínimo 6 caracteres",
      mask: null,
      type: "password",
    },
    {
      label: "Confirmar Senha *",
      key: "confirmarSenha",
      placeholder: "Repita a senha",
      mask: null,
      type: "password",
    },
  ];

  return (
    <div className="usuarios-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                Cadastro de Usuário
              </h1>
              <p
                style={{ margin: "3px 0 0", fontSize: 13.5, color: "#64748b" }}
              >
                Crie um novo acesso ao sistema
              </p>
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => navigate("/usuarios")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: 32,
            maxWidth: 680,
            animation: "fadeIn 0.4s ease",
          }}
        >
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Dados do Usuário
          </h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#94a3b8" }}>
            Preencha os campos obrigatórios (*)
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map(({ label, key, placeholder, mask, type }) => (
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
                  value={form[key]}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) =>
                    handleChange(
                      key,
                      mask ? mask(e.target.value) : e.target.value,
                    )
                  }
                  style={{
                    borderColor: focusedField === key ? "#1d4ed8" : undefined,
                  }}
                />
              </div>
            ))}

            {/* Tipo */}
            <div>
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
                Tipo
              </label>
              <div style={{ position: "relative" }}>
                <select
                  className="select-f"
                  value={form.tipo}
                  onChange={(e) => handleChange("tipo", e.target.value)}
                >
                  <option>Empresa</option>
                  <option>Contador</option>
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

            {form.tipo === "Contador" && (
              <div>
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
                  CNPJs Vinculados
                </label>

                {/* Lista de CNPJs adicionados */}
                {cnpjsVinculados.map((cnpj) => (
                  <div
                    key={cnpj}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      marginBottom: 6,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                      }}
                    >
                      {maskCNPJ(cnpj)}
                    </span>
                    <button
                      onClick={() => removerCnpj(cnpj)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#dc2626",
                        padding: 4,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
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
                ))}

                {/* Input para novo CNPJ */}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <input
                    className="input-f"
                    placeholder="00.000.000/0000-00"
                    value={novoCnpj}
                    onChange={(e) => setNovoCnpj(maskCNPJ(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn-primary"
                    onClick={adicionarCnpj}
                    style={{ padding: "8px 16px", whiteSpace: "nowrap" }}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            )}

            {/* Erro / Sucesso */}
            {erro && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: 13,
                  padding: "10px 14px",
                  background: "#fef2f2",
                  borderRadius: 8,
                  border: "1px solid #fecaca",
                }}
              >
                {erro}
              </div>
            )}
            {sucesso && (
              <div
                style={{
                  color: "#15803d",
                  fontSize: 13,
                  padding: "10px 14px",
                  background: "#dcfce7",
                  borderRadius: 8,
                  border: "1px solid #bbf7d0",
                }}
              >
                {sucesso}
              </div>
            )}

            {/* Botões */}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => navigate("/usuarios")}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                style={{
                  flex: 1,
                  textAlign: "center",
                  justifyContent: "center",
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  "Cadastrando..."
                ) : (
                  <>
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
                    Cadastrar Usuário
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
