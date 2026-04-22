import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import DocumentTable from "../components/DocumentTable";
import ImportModal from "../components/ImportModal";
import ImpressModal from "../components/ImpressModal";
import PeriodoPickerModal from "../components/PeriodoPickerModal";
import "../styles/documentos.css";

export default function Documentos() {
  const { user } = useAuth();

  /*const [verTodos, setVerTodos] = useState(false);*/
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
  const [impressModal, setImpressModal] = useState(false);
  const [openSelect, setOpenSelect] = useState(null);

  const [periodoModalOpen, setPeriodoModalOpen] = useState(false);
  const [periodoFiltro, setPeriodoFiltro] = useState(() => {
    const hoje = new Date();
    return { mes: hoje.getMonth(), ano: hoje.getFullYear() };
  }); // { mes, ano }

  const userType = user?.flg_conta || user?.flg_master ? "contador" : "empresa";

  const periodoInicio = useMemo(() => {
    if (!documentos.length) return "—";
    const datas = documentos
      .map((d) => d.data)
      .filter(Boolean)
      .sort();
    return datas[0] || "—";
  }, [documentos]);

  const periodoFim = useMemo(() => {
    if (!documentos.length) return "—";
    const datas = documentos
      .map((d) => d.data)
      .filter(Boolean)
      .sort();
    return datas[datas.length - 1] || "—";
  }, [documentos]);

  const clientesList = useMemo(() => {
    const nomesUnicos = [...new Set(allDocs.map((doc) => doc.cliente))].filter(
      Boolean,
    );
    return nomesUnicos.map((nome) => ({ value: nome, label: nome }));
  }, [allDocs]);

  const loadDocumentos = useCallback(() => {
    if (!user) return;

    setLoading(true);
    setErro("");

    const Contador = user?.flg_conta === true || user?.flg_master === true;

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
      EMPcpfCNPJ: doc.EMPcpfCNPJ,
      chave: doc.chave44 || extrairChave(doc.caminho),
      numero: String(doc.nroDoc) || "",
      cliente: Contador
        ? doc.nomeEmp || "EMISSOR"
        : doc.nomeCli || "CONSUMIDOR FINAL",
      clienteCNPJ: Contador
        ? doc.EMPcpfCNPJ || "—"
        : doc.CNPJCli === "00000000000"
          ? "—"
          : doc.CNPJCli || "—",
      data: doc.data ? new Date(doc.data).toLocaleDateString("pt-BR") : "",
      valor: parseFloat(doc.valor) || 0,
      status: mapStatus(doc.status),
      tipo: mapModelo(doc.modelo),
    });

    const params = new URLSearchParams();
    if (user.flg_master) {
      params.append("master", "true");
    } else if (user.flg_conta && user.idContador) {
      params.append("contadorId", user.idContador);
    } else {
      params.append("cnpj", user.EMPcpfCNPJ);
    }
    params.append("todos", "true");
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
  }, [user /*, verTodos*/]);

  useEffect(() => {
    loadDocumentos();
  }, [loadDocumentos]);

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

      if (periodoFiltro) {
        const [dia, mes, ano] = doc.data.split("/");
        if (!dia || !mes || !ano) return false;
        const docMes = parseInt(mes, 10) - 1;
        const docAno = parseInt(ano, 10);
        if (docMes !== periodoFiltro.mes || docAno !== periodoFiltro.ano)
          return false;
      }
      return true;
    });
    setDocumentos(filtrados);
  }, [
    busca,
    numDoc,
    clienteFiltro,
    tipoFiltro,
    statusFiltro,
    allDocs,
    periodoFiltro,
  ]);

  const total = allDocs.length;
  const autorizadas = allDocs.filter((d) => d.status === "Autorizada").length;
  const problemas = allDocs.filter((d) => d.status === "Com Problema").length;

  const periodoExibicao = useMemo(() => {
    if (periodoFiltro) {
      const data = new Date(periodoFiltro.ano, periodoFiltro.mes);
      return data
        .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
        .replace(". de ", "/")
        .replace(".", "");
    }
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
  }, [allDocs, periodoFiltro]);

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
      <main className="documentos-main">
        <div className="documentos-header">
          <div>
            <h1 className="documentos-header-title">Documentos</h1>
            <p className="documentos-header-subtitle">
              Gerencie XMLs e documentos fiscais
            </p>
          </div>
          <div className="documentos-actions">
            <button
              className="impress-btn"
              onClick={() => setImpressModal(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <path d="M6 9V3h12v6" />
                <rect x="6" y="15" width="12" height="6" rx="2" />
              </svg>
              Relatório
            </button>
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
        </div>

        {erro && <div className="documentos-error">{erro}</div>}

        <div className="documentos-stats-grid">
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
            value={periodoExibicao}
            label={periodoFiltro ? "Período (filtrado)" : "Período"}
            clickable
            onClick={() => setPeriodoModalOpen(true)}
          />
        </div>

        {loading ? (
          <div className="documentos-loading">Carregando documentos...</div>
        ) : (
          <>
            <FilterBar
              busca={busca}
              setBusca={setBusca}
              numDoc={numDoc}
              setNumDoc={setNumDoc}
              clienteFiltro={clienteFiltro}
              setClienteFiltro={setClienteFiltro}
              clientesList={clientesList}
              tipoFiltro={tipoFiltro}
              setTipoFiltro={setTipoFiltro}
              statusFiltro={statusFiltro}
              setStatusFiltro={setStatusFiltro}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
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
              /*verTodos={verTodos}
              setVerTodos={setVerTodos}*/
              onRefresh={loadDocumentos}
            />
          </>
        )}
      </main>

      <ImportModal isOpen={importModal} onClose={() => setImportModal(false)} />
      <ImpressModal
        isOpen={impressModal}
        onClose={() => setImpressModal(false)}
        documentos={documentos}
        userType={userType}
        periodoInicio={periodoInicio}
        periodoFim={periodoFim}
      />
      <PeriodoPickerModal
        isOpen={periodoModalOpen}
        onClose={() => setPeriodoModalOpen(false)}
        onConfirm={({ mes, ano }) => setPeriodoFiltro({ mes, ano })}
      />
    </div>
  );
}
