import { UserModel } from "../models/UserModel.js";
import {
  createUserService,
  getUsersService,
  updateUserService,
  deleteUserService,
} from "../services/UserService.js";

export const createUser = async (req, res) => {
  try {
    const solicitante = req.body;
    const user = await createUserService(req.body);
    res.json({
      message: "Usuário cadastrado com sucesso",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContadores = async (req, res) => {
  try {
    const contadores = await UserModel.findContadores();
    res.json(contadores);
  } catch (error) {
    console.error("Erro getContadores:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { id, cnpj } = req.query;
    const users = await getUsersService(id, cnpj);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await updateUserService(userID, req.body);
    res.json({
      message: "Alterações salvas com sucesso",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await deleteUserService(userID);
    res.json({
      message: "Usuário removido",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
