// services/acbrService.js
import path from "path";
import { fileURLToPath } from "url";
import ACBrLibNFe from "@projetoacbr/acbrlib-nfe-node/dist/src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuração da ACBrLib
const acbr = new ACBrLibNFe.default(
  path.resolve(__dirname, "../dist/lib/libacbrnfe64.so"), // Linux
  path.resolve(__dirname, "../dist/data/config/acbrlib.ini"),
);

// Inicializa a biblioteca (pode ser feito uma vez no startup)
await acbr.inicializar();

export async function gerarDanfePDF(xmlString) {
  try {
    // Carrega o XML na memória da ACBr
    await acbr.carregarXML(xmlString);

    // Gera o PDF da DANFE
    const pdfPath = await acbr.gerarPDF(); // retorna o caminho do arquivo temporário

    // Lê o arquivo gerado e retorna como Buffer
    const pdfBuffer = await fs.promises.readFile(pdfPath);
    return pdfBuffer;
  } catch (error) {
    throw new Error(`Erro ao gerar DANFE: ${error.message}`);
  }
}
