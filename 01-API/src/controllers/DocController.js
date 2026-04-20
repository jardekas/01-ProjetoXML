import {
  downloadXMLsService,
  createDocService,
  getDocService,
  getDocByCnpjService,
  marcarBaixadoService,
  getEmpresasDistintasService,
} from "../services/DocService.js";
import fs from "fs";
import { DocModel } from "../models/DocModel.js";
import { prisma } from "../db.js";

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

export const getEmpresas = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });
    let empresas = [];

    if (user.flg_master) {
      empresas = await getEmpresasDistintasService(null, true);
    } else if (user.flg_conta) {
      empresas = await getEmpresasDistintasService(user.idContador, false);
    } else {
      // Empresa comum: busca apenas o próprio CNPJ
      if (user.EMPcpfCNPJ) {
        empresas = await prisma.document.findMany({
          distinct: ["EMPcpfCNPJ"],
          where: { EMPcpfCNPJ: user.EMPcpfCNPJ },
          select: { EMPcpfCNPJ: true, nomeEmp: true },
          take: 1,
        });
      }
    }

    const seen = new Set();
    const resultado = empresas
      .filter((e) => {
        if (seen.has(e.EMPcpfCNPJ)) return false;
        seen.add(e.EMPcpfCNPJ);
        return true;
      })
      .map((e) => ({
        EMPcpfCNPJ: e.EMPcpfCNPJ,
        nomeEmp: e.nomeEmp,
      }));

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
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
    const { id, todos } = req.query;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    // Master: acesso total
    if (user.flg_master) {
      const docs = await getDocByCnpjService(
        null,
        todos === "true",
        null,
        true,
      );
      return res.json(docs);
    }

    // Contador: apenas CNPJs vinculados em CONTADOR_EMPRESA
    if (user.flg_conta) {
      if (!user.idContador) return res.json([]);
      const docs = await getDocByCnpjService(
        null,
        todos === "true",
        user.idContador,
        false,
      );
      return res.json(docs);
    }

    // Empresa: apenas próprio CNPJ
    if (user.EMPcpfCNPJ) {
      const docs = await getDocByCnpjService(user.EMPcpfCNPJ, todos === "true");
      return res.json(docs);
    }

    // Busca por IDs (fallback)
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
