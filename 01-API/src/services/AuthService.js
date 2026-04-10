import { UserModel } from "../models/UserModel.js";
import { gerarHash } from "../utils/hash.js";
//Serviço de login pra acessar o sistema.

export const loginService = async (email, senha) => {
  // Busca usuário pelo email
  const user = await UserModel.findByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (!user.flg_ativo) {
    throw new Error("Usuário inativo");
  }

  // Compara o hash da senha enviada com o hash salvo
  const hashSenha = gerarHash(senha);
  if (hashSenha !== user.hashSen) {
    throw new Error("Senha incorreta");
  }
  // Retorna apenas os dados necessários (sem hash)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    EMPcpfCNPJ: user.EMPcpfCNPJ,
    idContador: user.idContador,
    id_empresa: user.id_empresa,
    flg_admin: user.flg_admin,
    flg_conta: user.flg_conta,
    flg_master: user.flg_master,
  };
};
