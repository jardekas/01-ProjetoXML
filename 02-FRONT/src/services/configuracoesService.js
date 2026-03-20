import api from "./api";

export const TEMAS = [
  { id: "azul", label: "Azul Profissional", cores: ["#1e3a5f", "#3b82f6"] },
  { id: "verde", label: "Verde Contábil", cores: ["#16a34a", "#1d4ed8"] },
  { id: "roxo", label: "Roxo Executivo", cores: ["#7c3aed", "#f59e0b"] },
];

export const DADOS_INICIAIS = {
  nome: "",
  cnpj: "",
  cpf: "",
  crc: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

export const configService = {
  async getDados(user) {
    const base = {
      nome: user.name || "",
      cnpj: user.EMPcpfCNPJ || "",
      cpf: user.cpf || "",
      crc: "",
      email: user.email || "",
      senha: "",
      confirmarSenha: "",
    };

    if (user.flg_conta && user.idContador) {
      const res = await api.get(`/contador/${user.idContador}`);
      base.crc = res.data?.CRC || res.data?.crc || "";
    }

    return base;
  },

  async salvarDados(user, dados) {
    if (dados.senha && dados.senha !== dados.confirmarSenha) {
      throw new Error("As senhas não coincidem");
    }

    const payload = { name: dados.nome, email: dados.email };
    if (dados.senha) payload.senha = dados.senha;
    if (user.flg_conta && dados.crc) payload.crc = dados.crc;

    const response = await api.put(`/usuario/editar/${user.id}`, payload);
    return response.data;
  },
};
