import {
  downloadXMLsService,
  createDocService,
  getDocService,
  getDocByCnpjService,
  marcarBaixadoService,
} from "../services/DocService.js";
import fs from "fs";
import { DocModel } from "../models/DocModel.js";

//Marcado como baixado dos documentos
export const marcarBaixado = async (req, res) => {
  try {
    const { ids } = req.body; // array de ids
    if (!ids?.length)
      return res.status(400).json({ error: "Documentos não informados" });
    await marcarBaixadoService(ids);
    res.json({ message: "Documentos marcados como baixados" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//visualização de xml
export const visualizarDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocModel.findById(Number(id));
    if (!doc)
      return res.status(404).json({ error: "Documento não encontrado" });
    if (!fs.existsSync(doc.caminho))
      return res.status(404).json({ error: "Arquivo não encontrado" });

    const xml = fs.readFileSync(doc.caminho, "utf8");
    res.json({ xml, doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Download XMLs
export const downloadXMLs = async (req, res) => {
  try {
    const { EMPcpfCNPJ } = req.params;
    const { id } = req.query;
    const idUser = req.user.id;
    if (!idUser) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    if (!EMPcpfCNPJ) {
      return res.status(400).json({ error: "Empresa Inválida" });
    }
    if (!id) {
      return res.status(400).json({ error: "Selecione os XML's" });
    }
    const ids = String(id)
      .split(",")
      .map((v) => Number(v))
      .filter((v) => !isNaN(v));
    await downloadXMLsService(idUser, EMPcpfCNPJ, ids, res);
  } catch (error) {
    console.error("Erro detalhado:", error);
    res.status(500).json({ error: error.message });
  }
};

//Upload XML
export const createDoc = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "XML não enviado" });
    }
    const doc = await createDocService(req.file);
    res.json({
      message: "Upload do XML realizado com sucesso",
      doc,
    });
  } catch (error) {
    console.error("Erro detalhado:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDoc = async (req, res) => {
  try {
    const { id, cnpj, todos, contadorId } = req.query;

    if (cnpj || contadorId) {
      const docs = await getDocByCnpjService(
        cnpj,
        todos === "true",
        contadorId ? Number(contadorId) : null,
      );
      return res.json(docs);
    }

    const ids = id
      ? String(id)
          .split(",")
          .map((v) => Number(v))
          .filter((v) => !isNaN(v))
      : null;
    const docs = await getDocService(ids);

    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
