import { prisma } from "../db.js";
import { DocModel } from "../models/DocModel.js";
import { UserModel } from "../models/UserModel.js";
import { gerarHash } from "../utils/hash.js";
import fs from "fs";
import xml2js from "xml2js";
import archiver from "archiver";
import path from "path";

export const marcarBaixadoService = async (ids) => {
  return await DocModel.marcarBaixado(ids);
};

const mapModelo = (modelo) => {
  const map = {
    55: "NFe",
    65: "NFCe",
    57: "CTe",
    99: "NFSe",
    62: "NFCom", // NFCom (Modelo 62): Para serviços de comunicação.
    66: "NF3e", // Para energia elétrica.
  };
  return map[Number(modelo)] || "NFSe";
};

//Download XMLs
export const downloadXMLsService = async (idUser, EMPcpfCNPJ, ids, res) => {
  const user = await UserModel.findById(idUser);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const hashUser = user.hashCNPJ;
  const docs = await DocModel.findByUserAndIds(EMPcpfCNPJ, ids);
  if (!docs.length) {
    throw new Error(
      "Documentos não encontrados ou Não existem documentos para esse Usuário",
    );
  }

  // valida hash do documento
  for (const doc of docs) {
    if (doc.hashDoc !== hashUser) {
      throw new Error("Configuração de cadastro inválido.");
    }
  }

  const nomeArq = `xmls_${new Date().toISOString().slice(0, 10)}.zip`; // Formatação do nome do arquivo
  res.setHeader("Content-Type", "application/zip"); // Diz que tipo de arquivo está sendo enviado
  res.setHeader("Content-Disposition", `attachment; filename=${nomeArq}`); // Diz o que acontece com o arquivo.
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  for (const doc of docs) {
    if (doc.caminho && fs.existsSync(doc.caminho)) {
      archive.file(doc.caminho, {
        name: path.basename(doc.caminho),
      });
    }
  }
  await archive.finalize();
};

// Upload XML
export const createDocService = async (file) => {
  const caminho = file.path;
  const existe = await DocModel.findByCaminho(caminho);

  if (existe) {
    throw new Error("Já existe um XML com o mesmo nome. Upload não permitido.");
  }
  const xml = fs.readFileSync(caminho, "utf8");
  let result;

  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    result = await parser.parseStringPromise(xml);
  } catch {
    throw new Error("Arquivo enviado não é um XML válido.");
  }
  const nfe = result?.nfeProc?.NFe || result?.NFe;
  const prot = result?.nfeProc?.protNFe;
  if (!nfe) {
    throw new Error("XML inválido: NFe não encontrada.");
  }

  const infNFe = nfe.infNFe;
  const data = new Date(infNFe.ide.dhEmi || infNFe.ide.dEmi);
  const CNPJCli = infNFe.dest?.CPF || infNFe.dest?.CNPJ || "00000000000";
  const nomeCli = infNFe.dest?.xNome || "CONSUMIDOR FINAL";
  const chave44 =
    prot?.infProt?.chNFe || infNFe?.["$"]?.Id?.replace("NFe", "") || "";
  const tipoDoc = mapModelo(infNFe.ide.mod);
  const nroDoc = Number(infNFe.ide.nNF);
  const modelo = Number(infNFe.ide.mod);
  const valor = Number(infNFe.total.ICMSTot.vNF);
  const status = prot?.infProt?.cStat;
  const nomeEmp = infNFe.emit?.xFant || "EMITENTE";
  const EMPcpfCNPJ = infNFe.emit.CPF || infNFe.emit.CNPJ;
  const hashDoc = gerarHash(EMPcpfCNPJ);

  if (!status) {
    throw new Error("XML sem cStat. NFe não importada.");
  }
  const doc = await DocModel.create({
    data,
    nroDoc,
    CNPJCli,
    nomeCli,
    chave44,
    tipoDoc,
    valor,
    status,
    EMPcpfCNPJ,
    nomeEmp,
    modelo,
    caminho,
    hashDoc,
  });
  return doc;
};

export const getDocService = async (ids) => {
  if (!ids) {
    return await DocModel.findAll();
  }
  return await DocModel.findByIds(ids);
};

export const getDocByCnpjService = async (
  cnpj,
  todos = false,
  contadorId = null,
) => {
  // Se for contador, busca todos os CNPJs vinculados
  if (contadorId) {
    const vinculos = await prisma.contador_empresa.findMany({
      where: { contadorId: Number(contadorId) },
    });
    const cnpjs = vinculos.map((v) => v.cnpj);
    if (!cnpjs.length) return [];

    return await prisma.document.findMany({
      where: {
        EMPcpfCNPJ: { in: cnpjs },
        ...(todos ? {} : { baixado: false }),
      },
    });
  }

  return await DocModel.findByCnpj(cnpj, todos);
};
