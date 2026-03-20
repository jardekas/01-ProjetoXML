import api from "./api";

export const documentosService = {
  async getDocumentos(cnpj, todos = false) {
    const response = await api.get(`/document?cnpj=${cnpj}&todos=${todos}`);
    return Array.isArray(response.data) ? response.data : [];
  },
  async getDocumentosParams(params) {
    const response = await api.get(`/document?${params}`);
    return Array.isArray(response.data) ? response.data : [];
  },
};

export const TIPO_COLORS = {
  NFe: { bg: "#dbeafe", text: "#1d4ed8" },
  NFCe: { bg: "#d1fae5", text: "#065f46" },
  CTe: { bg: "#fef3c7", text: "#92400e" },
  NFSe: { bg: "#ede9fe", text: "#5b21b6" },
  NFCom: { bg: "#e0f2fe", text: "#0284c7" },
  NF3e: { bg: "#fef2f2", text: "#b91c1c" },
};

export const STATUS_STYLE = {
  Autorizada: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  "Com Problema": { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" },
  Cancelada: { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
};

export const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getDocumentosFiltrados = (docs, filtros) => {
  return docs.filter((doc) => {
    if (filtros.busca && !doc.chave?.includes(filtros.busca)) return false;
    if (filtros.numDoc && !doc.numero?.includes(filtros.numDoc)) return false;
    if (
      filtros.cliente &&
      !doc.cliente?.toLowerCase().includes(filtros.cliente.toLowerCase())
    )
      return false;
    if (filtros.tipo !== "Todos" && doc.tipo !== filtros.tipo) return false;
    if (filtros.status !== "Todos" && doc.status !== filtros.status)
      return false;
    return true;
  });
};
