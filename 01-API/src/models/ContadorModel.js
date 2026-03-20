import { prisma } from "../db.js";
import { gerarHash } from "../utils/hash.js";

export const ContadorModel = {
  async create(data) {
    return await prisma.contador.create({
      data,
    });
  },

  async findByUserId(idContador) {
    return await prisma.contador.findUnique({
      where: { id: idContador },
      include: { vinculos: true },
    });
  },

  async addVinculo(contadorId, cnpj) {
    return await prisma.contador_empresa.upsert({
      where: { contadorId_cnpj: { contadorId, cnpj } },
      update: {},
      create: {
        contadorId,
        cnpj,
        hashCNPJ: gerarHash(cnpj),
      },
    });
  },

  async removeVinculo(contadorId, cnpj) {
    return await prisma.contador_empresa.delete({
      where: { contadorId_cnpj: { contadorId, cnpj } },
    });
  },

  async getVinculos(contadorId) {
    return await prisma.contador_empresa.findMany({
      where: { contadorId },
    });
  },
};
