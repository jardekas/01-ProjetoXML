import { prisma } from "../db.js";
import { UserModel } from "../models/UserModel.js";
import { ContadorModel } from "../models/ContadorModel.js";
import { gerarHash } from "../utils/hash.js";

export const createUserService = async (dados, solicitante) => {
  const isMaster = solicitante?.flg_master;
  const isContador = solicitante?.flg_conta;
  const isAdm = solicitante?.flg_admin;

  if (isContador && !dados.flg_conta) {
    throw new Error(
      "Seu usuário só tem permissão para criar outros com o mesmo Tipo.(Contador)",
    );
  }
  if (isAdm && !isMaster && dados.flg_conta) {
    throw new Error(
      "Seu usuário só tem permissão para criar Usuários de mesmo nível ou inferior.(Admin)",
    );
  }
  if (isAdm && !isMaster && dados.flg_master) {
    throw new Error(
      "Seu usuário só tem permissão para criar Usuários de mesmo nível ou inferior.(Admin)",
    );
  }

  const hashCNPJ = gerarHash(dados.EMPcpfCNPJ);
  const hashSen = gerarHash(dados.senha);

  let idContador = null;
  if (dados.flg_conta) {
    const contador = await ContadorModel.create({
      name: dados.name,
      cnpj: dados.EMPcpfCNPJ,
      CRC: dados.crc || "",
    });
    idContador = contador.id;
  }
  const user = await UserModel.create({
    name: dados.name,
    email: dados.email,
    cpf: dados.cpf,
    EMPcpfCNPJ: dados.EMPcpfCNPJ,
    id_empresa: dados.id_empresa,
    hashCNPJ: hashCNPJ,
    hashSen: hashSen,
    idContador: idContador,
    telefone: dados.telefone,
    flg_conta: dados.flg_conta,
    flg_admin: dados?.flg_admin,
    flg_master: isMaster ? dados.flg_master || false : false,
  });
  return user;
};

export const getUsersService = async (id, cnpj) => {
  if (cnpj) {
    // Busca usuários da empresa
    const usuariosDaEmpresa = await UserModel.findByCnpj(cnpj);

    // Busca contadores vinculados via contador_empresa
    const vinculosContador = await prisma.contador_empresa.findMany({
      where: { cnpj },
      include: {
        contador: {
          include: {
            users: {
              where: { flg_ativo: true },
              include: { contador: true },
            },
          },
        },
      },
    });

    // Extrai os usuários contadores vinculados
    const contadoresVinculados = vinculosContador.flatMap(
      (v) => v.contador.users,
    );

    // Remove duplicatas (caso o contador tenha o mesmo CNPJ)
    const idsJaIncluidos = new Set(usuariosDaEmpresa.map((u) => u.id));
    const contadoresSemDuplicata = contadoresVinculados.filter(
      (u) => !idsJaIncluidos.has(u.id),
    );

    return [...usuariosDaEmpresa, ...contadoresSemDuplicata];
  }

  if (!id) {
    return await UserModel.findAll();
  }
  const ids = String(id)
    .split(",")
    .map((v) => Number(v))
    .filter((v) => !isNaN(v));
  return await UserModel.findByIds(ids);
};

export const updateUserService = async (userID, dados) => {
  const dataUpdate = { ...dados };

  if (dataUpdate.senha) {
    dataUpdate.hashSen = gerarHash(dataUpdate.senha);
    delete dataUpdate.senha;
  }

  if (dataUpdate.crc !== undefined) {
    const user = await UserModel.findById(Number(userID));
    if (user?.idContador) {
      await prisma.contador.update({
        where: { id: user.idContador },
        data: { CRC: dataUpdate.crc },
      });
    }
    delete dataUpdate.crc; // remove para não tentar salvar no user
  }

  return await UserModel.update(Number(userID), dataUpdate);
};

export const deleteUserService = async (userID) => {
  const user = await UserModel.deactivate(Number(userID));
  return user;
};
