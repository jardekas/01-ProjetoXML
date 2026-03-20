import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import DocumentTable from "../components/DocumentTable";
import ImportModal from "../components/ImportModal";
import "../styles/documentos.css";

export default function Documentos() {
  const { user } = useAuth();

  const [verTodos, setVerTodos] = useState(false);
  const [allDocs, setAllDocs] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [numDoc, setNumDoc] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState("Todos");

  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [importModal, setImportModal] = useState(false);

  const loadDocumentos = useCallback(() => {
    if (!user?.EMPcpfCNPJ) return;
    console.log("user:", user); // 👈 verificar flg_conta e idContador
    console.log("flg_conta:", user.flg_conta);
    console.log("idContador:", user.idContador);

    setLoading(true);
    setErro("");

    const Contador = user?.flg_conta === true;

    const extrairChave = (caminho) => {
      if (!caminho) return "";
      const arquivo = caminho.split(/[\\/]/).pop();
      return arquivo.replace(/\D/g, "").slice(0, 22) + "...";
    };

    const mapStatus = (status) => {
      const map = { 100: "Autorizada", 101: "Cancelada", 110: "Com Problema" };
      return map[String(status)] || "Com Problema";
    };

    const mapModelo = (modelo) => {
      const map = {
        55: "NFe",
        65: "NFCe",
        57: "CTe",
        99: "NFSe",
        62: "NFCom",
        66: "NF3e",
      };
      return map[Number(modelo)] || "NFSe";
    };

    const mapDoc = (doc) => ({
      id: doc.id,
      chave: doc.chave44 || extrairChave(doc.caminho),
      numero: String(doc.nroDoc) || "",
      cliente: Contador
        ? doc.nomeEmp || "EMISSOR"
        : doc.nomeCli || "CONSUMIDOR FINAL",
      clienteCNPJ: Contador
        ? doc.EMPcpfCNPJ || "—" // CNPJ da empresa emissora
        : doc.CNPJCli === "00000000000"
          ? "—"
          : doc.CNPJCli || "—", // CNPJ do destinatário
      data: doc.data ? new Date(doc.data).toLocaleDateString("pt-BR") : "",
      valor: parseFloat(doc.valor) || 0,
      status: mapStatus(doc.status),
      tipo: mapModelo(doc.modelo),
    });

    const params = new URLSearchParams({ todos: verTodos });
    if (user.flg_conta && user.idContador) {
      params.append("contadorId", user.idContador);
    } else {
      params.append("cnpj", user.EMPcpfCNPJ);
    }

    api
      .get(`/document?${params.toString()}`)
      .then((response) => {
        const lista = Array.isArray(response.data) ? response.data : [];
        const mapped = lista.map(mapDoc);
        setAllDocs(mapped);
        setDocumentos(mapped);
      })
      .catch(() => setErro("Erro ao carregar documentos"))
      .finally(() => setLoading(false));
  }, [user, verTodos]);

  useEffect(() => {
    loadDocumentos();
  }, [loadDocumentos]);

  // Filtros locais
  useEffect(() => {
    const filtrados = allDocs.filter((doc) => {
      if (busca && !doc.chave?.includes(busca)) return false;
      if (numDoc && !doc.numero?.includes(numDoc)) return false;
      if (
        clienteFiltro &&
        !doc.cliente?.toLowerCase().includes(clienteFiltro.toLowerCase())
      )
        return false;
      if (tipoFiltro !== "Todos" && doc.tipo !== tipoFiltro) return false;
      if (statusFiltro !== "Todos" && doc.status !== statusFiltro) return false;
      return true;
    });
    setDocumentos(filtrados);
  }, [busca, numDoc, clienteFiltro, tipoFiltro, statusFiltro, allDocs]);

  // Stats
  const total = allDocs.length;
  const autorizadas = allDocs.filter((d) => d.status === "Autorizada").length;
  const problemas = allDocs.filter((d) => d.status === "Com Problema").length;

  // Período
  const periodo = (() => {
    if (!allDocs.length) return "—";
    const datas = allDocs
      .map((d) => {
        const [dia, mes, ano] = d.data.split("/");
        return new Date(`${ano}-${mes}-${dia}`);
      })
      .filter((d) => !isNaN(d));
    if (!datas.length) return "—";
    const maisRecente = new Date(Math.max(...datas));
    return maisRecente
      .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
      .replace(". de ", "/")
      .replace(".", "");
  })();

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const toggleAll = () =>
    setSelected(
      selected.length === documentos.length ? [] : documentos.map((d) => d.id),
    );

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const sorted = sortCol
    ? [...documentos].sort((a, b) => {
        let va = a[sortCol],
          vb = b[sortCol];
        if (typeof va === "string") {
          va = va.toLowerCase();
          vb = vb.toLowerCase();
        }
        return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
      })
    : documentos;

  return (
    <div className="documentos-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
            animation: "fadeIn 0.4s ease",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              Documentos
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>
              Gerencie XMLs e documentos fiscais
            </p>
          </div>
          <button className="import-btn" onClick={() => setImportModal(true)}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Importar XMLs
          </button>
        </div>

        {erro && (
          <div
            style={{
              color: "#dc2626",
              fontSize: 13,
              padding: "8px 12px",
              background: "#fef2f2",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {erro}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 24,
            animation: "fadeIn 0.4s ease 0.05s both",
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            }
            bgColor="#eff6ff"
            value={total}
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            bgColor="#f0fdf4"
            value={autorizadas}
            label="Autorizadas"
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
            bgColor="#fff1f2"
            value={problemas}
            label="Com Problema"
          />
          <StatsCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0891b2"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            bgColor="#ecfeff"
            value={periodo}
            label="Período"
          />
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
            Carregando documentos...
          </div>
        ) : (
          <>
            <FilterBar
              busca={busca}
              setBusca={setBusca}
              numDoc={numDoc}
              setNumDoc={setNumDoc}
              clienteFiltro={clienteFiltro}
              setClienteFiltro={setClienteFiltro}
              tipoFiltro={tipoFiltro}
              setTipoFiltro={setTipoFiltro}
              statusFiltro={statusFiltro}
              setStatusFiltro={setStatusFiltro}
            />
            <DocumentTable
              documentos={sorted}
              selected={selected}
              onToggleSelect={toggleSelect}
              onToggleAll={toggleAll}
              sortCol={sortCol}
              sortDir={sortDir}
              onSort={handleSort}
              user={user}
              verTodos={verTodos}
              setVerTodos={setVerTodos}
              onRefresh={loadDocumentos}
            />
          </>
        )}
      </main>

      <ImportModal isOpen={importModal} onClose={() => setImportModal(false)} />
    </div>
  );
}
