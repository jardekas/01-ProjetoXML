import express from "express";
import {
  getVinculos,
  addVinculo,
  removeVinculo,
  getContador,
} from "../controllers/ContadorController.js";

const router = express.Router();

router.get("/contador/:contadorId/vinculos", getVinculos);
router.post("/contador/:contadorId/vinculos", addVinculo);
router.delete("/contador/:contadorId/vinculos/:cnpj", removeVinculo);
router.get("/contador/:contadorId", getContador);

export default router;
