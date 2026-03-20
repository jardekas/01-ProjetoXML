import { prisma } from "../db.js";

export const UserModel = {
  async create(data) {
    return await prisma.user.create({
      data,
    });
  },

  async findContadores() {
    return await prisma.user.findMany({
      where: { flg_conta: true, flg_ativo: true },
    });
  },

  async findByEmail(email) {
    return await prisma.user.findFirst({
      where: { email },
    });
  },

  async findAll() {
    return await prisma.user.findMany({
      where: { flg_ativo: true },
      include: { contador: true },
    });
  },

  async findByIds(ids) {
    return await prisma.user.findMany({
      where: {
        id: { in: ids },
        include: { contador: true },
      },
    });
  },

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  async findByCnpj(cnpj) {
    return await prisma.user.findMany({
      where: { EMPcpfCNPJ: cnpj, flg_ativo: true },
      include: { contador: true },
    });
  },

  async deactivate(id) {
    return await prisma.user.update({
      where: { id },
      data: { flg_ativo: false },
    });
  },

  async findById(idUser) {
    const user = await prisma.user.findUnique({
      where: {
        id: idUser,
      },
    });
    return user;
  },
};
