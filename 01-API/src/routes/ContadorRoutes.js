import express from "express";
import {
  getVinculos,
  addVinculo,
  removeVinculo,
  getContador,
  getContadoresByCnpj,
  syncVinculos,
} from "../controllers/ContadorController.js";

const router = express.Router();

router.get("/contador/:contadorId/vinculos", getVinculos);
router.post("/contador/:contadorId/vinculos", addVinculo);
router.delete("/contador/:contadorId/vinculos/:cnpj", removeVinculo);
router.get("/contador/:contadorId", getContador);
router.get("/contador/vinculos-por-cnpj/:cnpj", getContadoresByCnpj);
router.put("/contador/vinculos/:cnpj", syncVinculos);

export default router;
