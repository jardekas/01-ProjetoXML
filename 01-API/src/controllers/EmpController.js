import { EmpModel } from "../models/EmpModel.js";

export const createEmp = async (req, res) => {

    try {

        const user = await EmpModel.create(req.body);

        res.json({
            message: "Empresa cadastrada com sucesso",
            user
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

export const getEmp = async (req, res) => {

    try {

        const { id } = req.query;

        if (!id) {

            const users = await EmpModel.findAll();
            return res.json(users);

        }

        const ids = String(id)
            .split(',')
            .map(v => Number(v))
            .filter(v => !isNaN(v));

        const users = await EmpModel.findByIds(ids);

        res.json(users);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

export const updateEmp = async (req, res) => {

    try {

        const { userID } = req.params;
        const { nome, cnpj, email, telefone } = req.body;
        const user = await EmpModel.update(Number(userID), { nome, cnpj, email, telefone });

        res.json({
            message: "Alterações salvas com sucesso",
            user
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

export const deleteEmp = async (req, res) => {

    try {

        const { userID } = req.params;

        const user = await EmpModel.deactivate(Number(userID));

        res.json({
            message: "Empresa removida",
            user
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};