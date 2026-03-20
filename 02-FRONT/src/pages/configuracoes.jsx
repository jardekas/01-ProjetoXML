import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import ToggleSwitch from "../components/ToggleSwitch";
import TemaSelector from "../components/TemaSelector";
import UploadArea from "../components/UploadArea";
import InputField from "../components/InputField";
import Toast from "../components/Toast";
import api from "../services/api";
import { maskCNPJ } from "../utils/mask";
import {
  TEMAS,
  DADOS_INICIAIS,
  configService,
} from "../services/configuracoesService";
import "../styles/configuracoes.css";

export default function Configuracoes() {
  const { user } = useAuth();
  const Contador = user?.flg_conta === true;

  const [cnpjsVinculados, setCnpjsVinculados] = useState([]);
  const [novoCnpj, setNovoCnpj] = useState("");
  const [modoEscuro, setModoEscuro] = useState(false);
  const [temaAtivo, setTemaAtivo] = useState("azul");
  const [logoFile, setLogoFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hoverTema, setHoverTema] = useState(null);
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [focusedField, setFocusedField] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.idContador && Contador) {
      api
        .get(`/contador/${user.idContador}/vinculos`)
        .then((res) => setCnpjsVinculados(res.data.map((v) => v.cnpj)))
        .catch(console.error);
    }
  }, [user, Contador]);

  const adicionarCnpj = async () => {
    const cnpjLimpo = novoCnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      setErro("CNPJ inválido");
      return;
    }
    try {
      await api.post(`/contador/${user.idContador}/vinculos`, {
        cnpj: cnpjLimpo,
      });
      setCnpjsVinculados((prev) => [...prev, cnpjLimpo]);
      setNovoCnpj("");
      setErro("");
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao adicionar CNPJ");
    }
  };

  const removerCnpj = async (cnpj) => {
    try {
      await api.delete(`/contador/${user.idContador}/vinculos/${cnpj}`);
      setCnpjsVinculados((prev) => prev.filter((c) => c !== cnpj));
    } catch (err) {
      setErro("Erro ao remover CNPJ");
    }
  };

  useEffect(() => {
    if (user?.id) {
      configService
        .getDados(user)
        .then(setDados)
        .catch(() => setErro("Erro ao carregar dados do usuário"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    setErro("");
    try {
      await configService.salvarDados(user, dados);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setErro(error.message || "Erro ao salvar dados");
    }
  };

  return (
    <div className="configuracoes-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.05)} 100%{transform:scale(1)} }
      `}</style>

      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
            animation: "fadeIn 0.4s ease",
          }}
        >
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
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
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
              Configurações
            </h1>
            <p style={{ margin: "3px 0 0", fontSize: 13.5, color: "#64748b" }}>
              Personalize e gerencie seu escritório
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* LEFT: Personalização Visual */}
          <div
            className="card"
            style={{ animation: "fadeIn 0.4s ease 0.05s both" }}
          >
            <h2 className="section-title">
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#fdf4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                >
                  <circle cx="13.5" cy="6.5" r="2.5" />
                  <path d="M17.5 14c.83.66 1.5 1.45 1.5 2.5 0 2.21-3.13 4-7 4S5 18.71 5 16.5c0-1.05.67-1.84 1.5-2.5" />
                  <path d="M8.5 14c-.83.66-1.5 1.45-1.5 2.5" />
                  <circle cx="6.5" cy="9.5" r="2.5" />
                  <path d="M12 2C9 2 6 4 6 7c0 1.32.5 2.5 1.33 3.37" />
                </svg>
              </span>
              Personalização Visual
            </h2>
            <p className="section-sub">Personalize a aparência do sistema</p>

            <ToggleSwitch
              checked={modoEscuro}
              onChange={setModoEscuro}
              label="Modo Escuro"
              description="Alterna entre tema claro e escuro"
              icon={
                modoEscuro ? (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )
              }
            />

            <TemaSelector
              temas={TEMAS}
              temaAtivo={temaAtivo}
              onSelect={setTemaAtivo}
              hoverTema={hoverTema}
              setHoverTema={setHoverTema}
            />

            <div className="divider" />

            <UploadArea
              file={logoFile}
              onFileChange={setLogoFile}
              onFileRemove={() => setLogoFile(null)}
            />
          </div>

          {/* RIGHT: Dados do Usuário */}
          <div
            className="card"
            style={{ animation: "fadeIn 0.4s ease 0.1s both" }}
          >
            <h2 className="section-title">
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              Dados do Usuário
            </h2>
            <p className="section-sub">Informações do responsável técnico</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Nome */}
              <InputField
                label="Nome/Razão Social"
                value={dados.nome}
                onChange={(e) =>
                  setDados((d) => ({ ...d, nome: e.target.value }))
                }
                onFocus={() => setFocusedField("nome")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "nome"}
              />

              {/* CNPJ + CPF */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <InputField
                  label="CNPJ"
                  value={dados.cnpj}
                  onChange={(e) =>
                    setDados((d) => ({ ...d, cnpj: e.target.value }))
                  }
                  onFocus={() => setFocusedField("cnpj")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "cnpj"}
                  placeholder="00.000.000/0000-00"
                  monospace={true}
                />
                <InputField
                  label="CPF"
                  value={dados.cpf}
                  onChange={(e) =>
                    setDados((d) => ({ ...d, cpf: e.target.value }))
                  }
                  onFocus={() => setFocusedField("cpf")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "cpf"}
                  placeholder="000.000.000-00"
                  monospace={true}
                />
              </div>

              {/* CRC — só para contadores */}
              {Contador && (
                <InputField
                  label="CRC"
                  value={dados.crc}
                  onChange={(e) =>
                    setDados((d) => ({ ...d, crc: e.target.value }))
                  }
                  onFocus={() => setFocusedField("crc")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "crc"}
                  placeholder="0SP000000/O-0"
                  monospace={true}
                />
              )}

              {/* Empresas Vinculadas — só para contadores */}
              {Contador && (
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
                    Empresas Vinculadas
                  </label>
                  <p
                    style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}
                  >
                    Documentos dessas empresas aparecerão no seu painel
                  </p>

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

              {/* E-mail */}
              <InputField
                label="E-mail"
                value={dados.email}
                onChange={(e) =>
                  setDados((d) => ({ ...d, email: e.target.value }))
                }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "email"}
                placeholder="contador@empresa.com"
                icon={
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={focusedField === "email" ? "#1d4ed8" : "#94a3b8"}
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />

              {/* Senha */}
              <InputField
                label="Senha"
                value={dados.senha}
                onChange={(e) =>
                  setDados((d) => ({ ...d, senha: e.target.value }))
                }
                onFocus={() => setFocusedField("senha")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "senha"}
                placeholder="******"
                type="password"
                icon={
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={focusedField === "senha" ? "#1d4ed8" : "#94a3b8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
              />

              {/* Confirmar Senha */}
              <InputField
                label="Confirmar Senha"
                value={dados.confirmarSenha}
                onChange={(e) =>
                  setDados((d) => ({ ...d, confirmarSenha: e.target.value }))
                }
                onFocus={() => setFocusedField("confirmarSenha")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "confirmarSenha"}
                placeholder="******"
                type="password"
                icon={
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={
                      focusedField === "confirmarSenha" ? "#1d4ed8" : "#94a3b8"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
              />

              {erro && (
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: 13,
                    padding: "8px 12px",
                    background: "#fef2f2",
                    borderRadius: 8,
                  }}
                >
                  {erro}
                </div>
              )}

              <div className="divider" style={{ margin: "4px 0" }} />

              {/* Save button */}
              <button
                className={`save-btn${saved ? " saved" : ""}`}
                onClick={handleSave}
              >
                {saved ? (
                  <>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Dados Salvos!
                  </>
                ) : (
                  <>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Salvar Dados
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Toast
        message="Configurações salvas com sucesso"
        type="success"
        visible={saved}
      />
    </div>
  );
}
