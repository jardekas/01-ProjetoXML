// routes/danfe.js
//
// Rota simplificada: apenas valida o XML e devolve os dados estruturados.
// A geração do PDF/impressão acontece 100% no frontend (DanfeModal.jsx).
// As dependências @alexssmusica/node-pdf-nfe e node-jre foram removidas.

import express from "express";
import { DOMParser } from "@xmldom/xmldom"; // npm install @xmldom/xmldom

const router = express.Router();

// ─── helpers ────────────────────────────────────────────────────────────────

const getTagValue = (parent, tagName) => {
  const el = parent?.getElementsByTagName(tagName)[0];
  return el?.textContent || "";
};

/**
 * Valida o XML e extrai os dados mínimos para uso no frontend.
 * Lança Error se o XML for inválido ou não for uma NF-e.
 */
function validarEExtrairResumo(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) throw new Error("XML malformado.");

  let nfe = doc.getElementsByTagName("NFe")[0];
  if (!nfe) {
    nfe = doc
      .getElementsByTagName("nfeProc")[0]
      ?.getElementsByTagName("NFe")[0];
  }
  if (!nfe) throw new Error("Tag <NFe> não encontrada no XML.");

  const infNFe = nfe.getElementsByTagName("infNFe")[0];
  const ide = infNFe.getElementsByTagName("ide")[0];
  const emit = infNFe.getElementsByTagName("emit")[0];
  const prot = doc
    .getElementsByTagName("protNFe")[0]
    ?.getElementsByTagName("infProt")[0];

  return {
    numero: getTagValue(ide, "nNF"),
    serie: getTagValue(ide, "serie"),
    emitente: getTagValue(emit, "xNome"),
    cnpjEmitente: getTagValue(emit, "CNPJ"),
    protocolo: prot?.getElementsByTagName("nProt")[0]?.textContent || "",
    autorizado: !!prot,
  };
}

// ─── POST /api/danfe/validar ─────────────────────────────────────────────────
//
// Recebe { xml: "<string>" } e devolve um resumo da NF-e.
// Útil para o frontend confirmar que o XML é válido antes de renderizar.

router.post("/validar", (req, res) => {
  try {
    const { xml } = req.body;
    if (!xml)
      return res.status(400).json({ error: "Campo 'xml' obrigatório." });

    const resumo = validarEExtrairResumo(xml);
    return res.json({ ok: true, resumo });
  } catch (error) {
    console.error("[danfe/validar]", error.message);
    return res.status(422).json({ error: error.message });
  }
});

// ─── POST /api/danfe/gerar  (mantida por compatibilidade) ───────────────────
//
// Anteriormente gerava PDF no servidor. Agora informa ao cliente
// que a geração deve ser feita localmente via DanfeModal.

router.post("/gerar", (req, res) => {
  return res.status(410).json({
    error:
      "Esta rota foi descontinuada. A geração do DANFE agora ocorre no frontend. " +
      "Use o componente DanfeModal com o XML diretamente.",
    migracao: "Consulte DanfeModal.jsx e danfeUtils.js",
  });
});

export default router;
