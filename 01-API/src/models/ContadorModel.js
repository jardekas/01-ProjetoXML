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

  async getContadoresByCnpj(cnpj) {
    return await prisma.contador_empresa.findMany({
      where: { cnpj },
      select: { contadorId: true },
    });
  },

  async syncVinculos(cnpj, contadorIds) {
    return await prisma.$transaction(async (tx) => {
      // Remove vínculos que não estão na nova lista
      await tx.contador_empresa.deleteMany({
        where: {
          cnpj,
          contadorId: { notIn: contadorIds },
        },
      });
      // Adiciona novos vínculos (ignora duplicados)
      if (contadorIds.length > 0) {
        const data = contadorIds.map((contadorId) => ({
          contadorId,
          cnpj,
          hashCNPJ: gerarHash(cnpj),
        }));
        await tx.contador_empresa.createMany({
          data,
          skipDuplicates: true,
        });
      }
    });
  },
};
