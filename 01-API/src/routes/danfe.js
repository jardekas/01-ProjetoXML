import express from "express";
import { gerarDanfePDF } from "../services/danfeService.js";

const router = express.Router();

router.post("/gerar", async (req, res) => {
  try {
    const { xml } = req.body;
    if (!xml) return res.status(400).json({ error: "XML não fornecido" });

    const pdfBuffer = await gerarDanfePDF(xml);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="danfe.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar DANFE:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
