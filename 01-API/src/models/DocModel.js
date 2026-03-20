import { prisma } from "../db.js";

export const DocModel = {
  async marcarBaixado(ids) {
    return await prisma.document.updateMany({
      where: { id: { in: ids } },
      data: { baixado: true },
    });
  },

  async create(data) {
    return await prisma.document.create({
      data,
    });
  },

  async findById(id) {
    return await prisma.document.findUnique({ where: { id } });
  },

  async findAll() {
    return await prisma.document.findMany();
  },

  async findByCnpj(cnpj, todos = false) {
    return await prisma.document.findMany({
      where: {
        EMPcpfCNPJ: cnpj,
        ...(todos ? {} : { baixado: false }), // se todos=true, ignora o filtro
      },
    });
  },

  async findByIds(ids) {
    return await prisma.document.findMany({
      where: {
        id: { in: ids },
      },
    });
  },

  async update(id, data) {
    return await prisma.document.update({
      where: { id },
      data,
    });
  },

  async findByCaminho(caminho) {
    return prisma.document.findFirst({
      where: { caminho },
    });
  },

  async findByUserAndIds(EMPcpfCNPJ, ids) {
    // Método para download xml com usuário e xml;
    return prisma.document.findMany({
      where: {
        EMPcpfCNPJ,
        id: {
          in: ids,
        },
      },
    });
  },
};
