import { prisma } from "../db.js";

export const EmpModel = {

    async create(data) {
        return await prisma.empresa.create({
            data
        });
    },

    async findAll() {
        return await prisma.empresa.findMany({
            where: { flg_ativo: true }
        });
    },

    async findByIds(ids) {
        return await prisma.empresa.findMany({
            where: {
                id: { in: ids }
            }
        });
    },

    async update(id, data) {
        return await prisma.empresa.update({
            where: { id },
            data
        });
    },

    async deactivate(id) {
        return await prisma.empresa.update({
            where: { id },
            data: { flg_ativo: false }
        });
    }

};