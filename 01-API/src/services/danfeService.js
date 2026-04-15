import { gerarPDF } from "@alexssmusica/node-pdf-nfe";
import xml2js from "xml2js";

export async function gerarDanfePDF(xmlString, opcoes = {}) {
  try {
    // 1. Parse do XML para objeto
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true, // junta atributos como propriedades
      attrkey: "$", // mantém atributos na chave "$"
    });
    const xmlObj = await parser.parseStringPromise(xmlString);

    // 2. Acessa o nó principal
    const infNFe = xmlObj.nfeProc?.NFe?.infNFe;
    if (!infNFe) {
      throw new Error("XML inválido: estrutura infNFe não encontrada.");
    }

    // 3. Coleta o texto de infCpl existente (se houver)
    let textoComplementar = infNFe.infCpl?.xTexto || "";

    // 4. Extrai observações de infAdic
    const infAdic = infNFe.infAdic;
    if (infAdic?.obsCont) {
      // Garante que seja um array
      const obsArray = Array.isArray(infAdic.obsCont)
        ? infAdic.obsCont
        : [infAdic.obsCont];
      const textosObs = obsArray.map((o) => o.xTexto).filter(Boolean);

      if (textosObs.length) {
        const textoAdicional = textosObs.join("; ");
        textoComplementar = textoComplementar
          ? `${textoComplementar}; ${textoAdicional}`
          : textoAdicional;
      }
    }

    // 5. Atualiza ou cria o campo infCpl
    if (textoComplementar) {
      infNFe.infCpl = { xTexto: textoComplementar };
    }

    // 6. Remove a seção infAdic para evitar qualquer tentativa de renderização
    //delete infNFe.infAdic;

    // 7. Converte o objeto de volta para string XML
    const builder = new xml2js.Builder({
      xmldec: { version: "1.0", encoding: "UTF-8" },
      renderOpts: { pretty: false },
    });
    const xmlModificado = builder.buildObject(xmlObj);

    // 8. Gera o PDF
    const doc = await gerarPDF(xmlModificado, opcoes);

    // Converte o stream do PDF para Buffer
    const chunks = [];
    for await (const chunk of doc) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    throw new Error(`Erro ao gerar DANFE: ${error.message}`);
  }
}
