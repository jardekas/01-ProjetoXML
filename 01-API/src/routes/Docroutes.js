import express from "express";
import { upload } from "../config/upload.js";
import {
  createDoc,
  getDoc,
  downloadXMLs,
  visualizarDoc,
  marcarBaixado,
} from "../controllers/DocController.js";

const router = express.Router();

router.patch("/document/baixado", marcarBaixado);
router.get("/document/:EMPcpfCNPJ/download", downloadXMLs); // Ex.: GET http://localhost:3000/Document/12764626000153/download?id=1,2,3
router.post("/document/upload", upload.single("xml"), createDoc);
router.get("/document", getDoc); //passado como parametro: ?id=1,2,3
router.get("/document/visualizar/:id", visualizarDoc);

export default router;
