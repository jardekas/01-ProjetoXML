import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { maskCPF, maskCNPJ, maskPhone } from "../utils/mask";
import "../styles/usuarios.css";

export default function Cadastro() {
  const [cnpjsVinculados, setCnpjsVinculados] = useState([]);
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
      <main className="cadastro-main">
        <div className="cadastro-header">
          <div className="cadastro-header-left">
            <div className="cadastro-header-icon">
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
              <h1 className="cadastro-title">Cadastro de Usuário</h1>
              <p className="cadastro-subtitle">
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

        <div className="cadastro-card">
          <h2 className="cadastro-card-title">Dados do Usuário</h2>
          <p className="cadastro-card-desc">
            Preencha os campos obrigatórios (*)
          </p>

          <div className="cadastro-form">
            {fields.map(({ label, key, placeholder, mask, type }) => (
              <div key={key}>
                <label className="cadastro-label">{label}</label>
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

            <div>
              <label className="cadastro-label">Tipo</label>
              <div className="select-wrapper">
                <select
                  className="select-f"
                  value={form.tipo}
                  onChange={(e) => handleChange("tipo", e.target.value)}
                >
                  <option>Empresa</option>
                  <option>Contador</option>
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

            {erro && <div className="cadastro-error">{erro}</div>}
            {sucesso && <div className="cadastro-success">{sucesso}</div>}

            <div className="cadastro-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate("/usuarios")}
              >
                Cancelar
              </button>
              <button
                className="btn-primary cadastro-submit"
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
