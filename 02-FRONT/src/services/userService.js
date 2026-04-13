import api from "./api";

// Mapeamento entre o formato do frontend e o backend
const mapFrontToBack = (userData) => ({
  name: userData.nome,
  email: userData.email,
  cpf: userData.cpf.replace(/\D/g, ""),
  EMPcpfCNPJ: userData.cnpj.replace(/\D/g, ""),
  telefone: userData.telefone?.replace(/\D/g, ""),
  id_empresa: userData.id_empresa || 16685, // Ajuste conforme necessário
  senha: userData.senha || "senha1234", // Idealmente o usuário define a senha
  flg_conta: userData.tipo === "Contador",
  crc: userData.crc || "",
  flg_admin: userData.flg_admin || false,
});

const mapBackToFront = (userData) => ({
  id: userData.id,
  nome: userData.name,
  email: userData.email,
  cpf: userData.cpf,
  cnpj: userData.EMPcpfCNPJ,
  idContador: userData.idContador,
  crc: userData.crc,
  telefone: userData.telefone,
  tipo: userData.flg_conta ? "Contador" : "Empresa",
  status: userData.flg_ativo ? "Ativo" : "Inativo",
  flg_admin: userData.flg_admin || false,
  criacao: userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("pt-BR")
    : new Date().toLocaleDateString("pt-BR"),
});

export const userService = {
  // GET /usuario
  async getUsers(cnpj) {
    try {
      const url = cnpj ? `/usuario?cnpj=${cnpj}` : `/usuario`;
      const response = await api.get(url);
      return Array.isArray(response.data)
        ? response.data.map(mapBackToFront)
        : [];
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  // GET /usuario?id=xxx
  async getUserById(id) {
    try {
      const response = await api.get(`/usuario?id=${id}`);
      return response.data[0] ? mapBackToFront(response.data[0]) : null;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  },

  // POST /usuario/cadastro
  async createUser(userData) {
    try {
      const backendData = mapFrontToBack(userData);
      console.log("Enviando para API:", backendData);
      const response = await api.post("/usuario/cadastro", backendData);
      return mapBackToFront(response.data.user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  // PUT /usuario/editar/:userID
  async updateUser(userId, userData) {
    try {
      const backendData = mapFrontToBack(userData);
      const response = await api.put(`/usuario/editar/${userId}`, backendData);
      return mapBackToFront(response.data.user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  // PUT /usuario/delete/:userID
  async deleteUser(userId) {
    try {
      const response = await api.put(`/usuario/delete/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  },
};
