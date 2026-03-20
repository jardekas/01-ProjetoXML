import express from "express";
import {
    createEmp,
    getEmp,
    updateEmp,
    deleteEmp
} from "../controllers/EmpController.js";

const router = express.Router();

router.post("/Empresa/cadastro", createEmp);
router.get("/Empresa", getEmp);
router.put("/Empresa/editar/:empID", updateEmp);
router.put("/Empresa/delete/:empID", deleteEmp);

export default router;