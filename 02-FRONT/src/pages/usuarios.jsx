import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import StatsCard from "../components/StatsCard";
import UserTable from "../components/UserTable";
import UserModal from "../components/CriarUserModal";
import AdcContadorModal from "../components/AdcContadorModal";
import { userService } from "../services/userService";
import { USERS_MOCK, EMPTY_USER } from "../services/usuariosService"; // Importa os dados mockados e a função de estatísticas
import "../styles/usuarios.css";

/*const mapBackToFront = (user) => ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  cpf: user.cpf,
  cnpj: user.cnpj,
  telefone: user.telefone,
  tipo: user.tipo,
  idContador: user.idContador,
  ativo: user.ativo,
});*/

export default function Usuarios() {
  const { user } = useAuth();
  const [adcContadorModal, setAdcContadorModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [search, setSearch] = useState("");
  const [isContadorDelete, setIsContadorDelete] = useState(false);
  const isMaster = user?.flg_master === true;
  const isContador = user?.flg_conta === true;
  const isAdm = user?.flg_admin === true;
  const isEmpresa = !isMaster && !isContador;
  const podeVerTudo = isAdm || isMaster;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (isMaster) {
        data = await userService.getUsers(); // todos
      } else if (isContador) {
        data = await userService.getUsers(user.EMPcpfCNPJ); // vinculados
      } else {
        data = await userService.getUsers(user.EMPcpfCNPJ); // mesmo CNPJ
      }
      setUsers(data);
    } catch {
      setUsers(USERS_MOCK);
    } finally {
      setLoading(false);
    }
  }, [isContador, isMaster, user]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = users.filter(
    (u) =>
      u.nome?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.cpf?.includes(search),
  );

  const stats = useMemo(() => {
    const total = users.length;
    const ativos = users.filter((u) => u.ativo === true).length;
    const inativos = users.filter((u) => u.ativo === false).length;
    const admins = users.filter((u) => u.flg_admin === true).length;
    return { total, ativos, inativos, admins };
  }, [users]);

  const openNew = () => {
    let tipoDefault = "Empresa";
    if (isContador && !isMaster) tipoDefault = "Contador";
    if (isMaster) tipoDefault = "Empresa";
    setForm({ ...EMPTY_USER, tipo: tipoDefault });
    setEditId(null);
    setModal("new");
  };

  const openEdit = (u) => {
    setForm({
      nome: u.nome,
      cpf: u.cpf,
      cnpj: u.cnpj || "",
      email: u.email,
      telefone: u.telefone || "",
      tipo: u.tipo || "Empresa",
    });
    setEditId(u.id);
    setModal("edit");
  };

  const openDelete = (id, isContador = false) => {
    if (id === user?.id) {
      alert("Você não pode excluir seu próprio usuário.");
      return;
    }

    setDeleteId(id);
    setIsContadorDelete(isContador);
    setModal("delete");
  };

  const openPermissions = (id) => {
    setEditId(id);
    setModal("perms");
  };

  const closeModal = () => {
    setModal(null);
    setEditId(null);
    setDeleteId(null);
  };

  const saveUser = async () => {
    if (!form.nome || !form.email || !form.cpf || !form.cnpj) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (!editId) {
      if (!form.senha) {
        alert("Informe uma senha");
        return;
      }
      if (form.senha !== form.confirmarSenha) {
        alert("As senhas não coincidem");
        return;
      }
    }

    try {
      if (editId) {
        await userService.updateUser(editId, form);
      } else {
        await userService.createUser(form);
        alert(
          `Usuário criado com sucesso!\nSenha: ${form.senha || "senha1234"}`,
        );
      }
      await loadUsers(); // Recarrega a lista
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário. Tente novamente.");
    }
  };

  const confirmDelete = async () => {
    try {
      if (isContadorDelete) {
        // Desvincula contador — busca o idContador do user
        const userAlvo = users.find((u) => u.id === deleteId);
        console.log("userAlvo:", userAlvo);
        await api.delete(
          `/contador/${userAlvo.idContador}/vinculos/${user.EMPcpfCNPJ}`,
        );
      } else {
        // Inativar usuário normal
        await userService.deleteUser(deleteId);
      }
      await loadUsers(); // Recarrega a lista
      closeModal();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Erro ao deletar usuário. Tente novamente.");
    }
  };

  return (
    <div className="usuarios-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
                Usuários
              </h1>
              <p
                style={{ margin: "3px 0 0", fontSize: 13.5, color: "#64748b" }}
              >
                Gerencie os usuários do escritório
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {podeVerTudo && (
              <button className="btn-primary" onClick={openNew}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Novo Usuário
              </button>
            )}
            {isMaster && (
              <button
                className="btn-primary"
                onClick={() => setAdcContadorModal(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Gerenciar Contador
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatsCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            bgColor="#eff6ff"
            value={stats.total}
            label="Total"
          />
          <StatsCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            }
            bgColor="#f0fdf4"
            value={stats.ativos}
            label="Ativos"
          />
          <StatsCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="17" y1="11" x2="22" y2="11" />
              </svg>
            }
            bgColor="#fffbeb"
            value={stats.inativos}
            label="Inativos"
          />
          <StatsCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 1 0-16 0" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            }
            bgColor="#fef2f2"
            value={stats.admins}
            label="Admins"
          />
        </div>

        {/* Tabela */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Lista de Usuários
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                Gerencie os usuários do escritório
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="input-f"
                style={{ paddingLeft: 36, width: 240 }}
                placeholder="Buscar usuário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div
              style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}
            >
              Carregando usuários...
            </div>
          ) : (
            <UserTable
              currentUserId={user?.id}
              users={filtered}
              hoverRow={hoverRow}
              setHoverRow={setHoverRow}
              onEdit={openEdit}
              onDelete={openDelete}
              onPermissions={openPermissions}
            />
          )}

          <div
            style={{
              padding: "14px 24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Exibindo <strong>{filtered.length}</strong> de{" "}
              <strong>{users.length}</strong> usuários
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  background: "#1d4ed8",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                1
              </button>
            </div>
          </div>
        </div>
      </main>

      <UserModal
        modal={modal}
        form={form}
        setForm={setForm}
        editId={editId}
        onClose={closeModal}
        onSave={saveUser}
        onConfirmDelete={confirmDelete}
        isContadorDelete={isContadorDelete}
        podecriarEmpresa={isMaster || isEmpresa}
        podecriarContador={isMaster || isContador}
        podecriarMaster={isMaster}
      />
      <AdcContadorModal
        isOpen={adcContadorModal}
        onClose={() => setAdcContadorModal(false)}
        user={user}
        onSaved={loadUsers}
      />
    </div>
  );
}
