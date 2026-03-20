import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getContadores,
} from "../controllers/userController.js";

const router = express.Router();

router.patch("/usuario/editar/:userID", updateUser);
router.get("/contador/lista", getContadores);
router.post("/usuario/cadastro", createUser);
router.get("/usuario", getUsers);
router.put("/usuario/editar/:userID", updateUser);
router.put("/usuario/delete/:userID", deleteUser);

export default router;
