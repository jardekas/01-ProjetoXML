// routes/danfe.js
import express from "express";
import { gerarDanfePDF } from "../services/acbrService.js";

const router = express.Router();

router.post("/danfe/gerar", async (req, res) => {
  try {
    const { xml } = req.body; // ou buscar pelo ID no banco
    const pdfBuffer = await gerarDanfePDF(xml);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="danfe.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
