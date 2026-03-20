import api from "./api";

export const PERIODOS = [
  "Este mês",
  "Últimos 3 meses",
  "Últimos 6 meses",
  "Este ano",
];
export const TIPOS = ["Todos os tipos", "NFe", "NFCe", "CTe", "NFSe"];
export const CLIENTES = [];

export const LEGEND_ITEMS = [
  { color: "#1e3a5f", label: "NFe" },
  { color: "#22c55e", label: "NFCe" },
  { color: "#f59e0b", label: "CTe" },
  { color: "#a855f7", label: "NFSe" },
];

const TIPO_COLORS = {
  NFe: "#1e3a5f",
  NFCe: "#22c55e",
  CTe: "#f59e0b",
  NFSe: "#a855f7",
};

const mapModelo = (modelo) => {
  const map = { 55: "NFe", 65: "NFCe", 57: "CTe", 99: "NFSe" };
  return map[Number(modelo)] || "NFSe";
};

const mapStatus = (status) => {
  const map = { 100: "Autorizada", 101: "Cancelada", 110: "Com Problema" };
  return map[String(status)] || "Com Problema";
};

export const dashboardService = {
  async getDados(user, periodo = "", tipo = "Todos os tipos", cliente = "") {
    const isContador = user?.flg_conta && user?.idContador;
    const params = new URLSearchParams({ todos: true });
    if (isContador) {
      params.append("contadorId", user.idContador);
    } else {
      params.append("cnpj", user.EMPcpfCNPJ);
    }

    const response = await api.get(`/document?${params.toString()}`);
    let docs = Array.isArray(response.data) ? response.data : [];
    if (periodo) {
      const hoje = new Date();
      const de = new Date();
      if (periodo === "Este mês") de.setDate(1);
      if (periodo === "Últimos 3 meses") de.setMonth(hoje.getMonth() - 3);
      if (periodo === "Últimos 6 meses") de.setMonth(hoje.getMonth() - 6);
      if (periodo === "Este ano") de.setMonth(0, 1);

      docs = docs.filter((d) => d.data && new Date(d.data) >= de);
    }

    if (tipo && tipo !== "Todos os tipos") {
      docs = docs.filter((d) => mapModelo(d.modelo) === tipo);
    }

    if (cliente) {
      docs = docs.filter((d) =>
        d.nomeEmp?.toLowerCase().includes(cliente.toLowerCase()),
      );
    }

    const clientes = [
      ...new Set(
        (Array.isArray(response.data) ? response.data : [])
          .map((d) => d.nomeEmp)
          .filter(Boolean),
      ),
    ].sort();

    // Gráfico de Barra: documentos por mês
    const mesesMap = {};
    docs.forEach((doc) => {
      if (!doc.data) return;
      const d = new Date(doc.data);
      const mes = d
        .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
        .replace(". de ", "/")
        .replace(".", "");
      const tipo = mapModelo(doc.modelo).toLowerCase();

      if (!mesesMap[mes])
        mesesMap[mes] = { mes, nfe: 0, nfce: 0, cte: 0, nfse: 0 };
      if (tipo === "nfe") mesesMap[mes].nfe++;
      if (tipo === "nfce") mesesMap[mes].nfce++;
      if (tipo === "cte") mesesMap[mes].cte++;
      if (tipo === "nfse") mesesMap[mes].nfse++;
    });

    const barData = Object.values(mesesMap).slice(-6); // últimos 6 meses

    // Pie Chart: distribuição por tipo
    const tiposCount = { NFe: 0, NFCe: 0, CTe: 0, NFSe: 0 };
    docs.forEach((doc) => {
      tiposCount[mapModelo(doc.modelo)]++;
    });
    const total = docs.length || 1;
    const pieData = Object.entries(tiposCount)
      .filter(([, v]) => v > 0)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        color: TIPO_COLORS[name],
      }));

    // KPIs
    const totalValor = docs.reduce(
      (acc, d) => acc + parseFloat(d.valor || 0),
      0,
    );
    const autorizadas = docs.filter(
      (d) => mapStatus(d.status) === "Autorizada",
    ).length;
    const problemas = docs.filter(
      (d) => mapStatus(d.status) === "Com Problema",
    ).length;

    const kpiData = [
      {
        label: "Total de Docs",
        value: String(docs.length),
        trend: "",
        trendUp: true,
        icon: (
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
        ),
      },
      {
        label: "Autorizadas",
        value: String(autorizadas),
        trend: "",
        trendUp: true,
        icon: (
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
        ),
      },
      {
        label: "Com Problema",
        value: String(problemas),
        trend: "",
        trendUp: false,
        icon: (
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
        ),
      },
      {
        label: "Valor Total",
        value: totalValor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        trend: "",
        trendUp: true,
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0891b2"
            strokeWidth="2"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
    ];

    return { barData, pieData, kpiData, clientes };
  },
};
