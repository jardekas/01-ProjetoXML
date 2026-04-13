// utils/danfeUtils.js

const parseXMLString = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("XML inválido: " + errorNode.textContent);
  }
  return doc;
};

const getTagValue = (parent, tagName) => {
  const el = parent?.getElementsByTagName(tagName)[0];
  return el?.textContent || "";
};

const extrairDadosNFe = (xmlDoc) => {
  let nfe = xmlDoc.getElementsByTagName("NFe")[0];
  if (!nfe) {
    nfe = xmlDoc
      .getElementsByTagName("nfeProc")[0]
      ?.getElementsByTagName("NFe")[0];
  }
  if (!nfe) throw new Error("Tag NFe não encontrada");

  const infNFe = nfe.getElementsByTagName("infNFe")[0];
  const ide = infNFe.getElementsByTagName("ide")[0];
  const emit = infNFe.getElementsByTagName("emit")[0];
  const dest = infNFe.getElementsByTagName("dest")[0];
  const total = infNFe
    .getElementsByTagName("total")[0]
    ?.getElementsByTagName("ICMSTot")[0];
  const prot = xmlDoc
    .getElementsByTagName("protNFe")[0]
    ?.getElementsByTagName("infProt")[0];
  const infAdic = infNFe.getElementsByTagName("infAdic")[0];
  const transp = infNFe.getElementsByTagName("transp")[0];
  const cobr = infNFe.getElementsByTagName("cobr")[0];
  const exporta = infNFe.getElementsByTagName("exporta")[0];

  const chave =
    prot?.getElementsByTagName("chNFe")[0]?.textContent ||
    infNFe.getAttribute("Id")?.replace("NFe", "") ||
    "";

  const produtos = Array.from(infNFe.getElementsByTagName("det")).map((det) => {
    const prod = det.getElementsByTagName("prod")[0];
    const imposto = det.getElementsByTagName("imposto")[0];
    const icms = imposto?.getElementsByTagName("ICMS")[0];
    const icmsTag = icms?.children[0];
    const cst = icmsTag ? icmsTag.tagName.replace("ICMS", "") : "";
    return {
      codigo: getTagValue(prod, "cProd"),
      descricao: getTagValue(prod, "xProd"),
      ncm: getTagValue(prod, "NCM"),
      cfop: getTagValue(prod, "CFOP"),
      unidade: getTagValue(prod, "uCom"),
      quantidade: parseFloat(getTagValue(prod, "qCom")) || 0,
      valorUnitario: parseFloat(getTagValue(prod, "vUnCom")) || 0,
      valorTotal: parseFloat(getTagValue(prod, "vProd")) || 0,
      cst,
    };
  });

  const transporta = transp?.getElementsByTagName("transporta")[0];
  const vol = transp?.getElementsByTagName("vol")[0];

  const dups = cobr
    ? Array.from(cobr.getElementsByTagName("dup")).map((dup) => ({
        numero: getTagValue(dup, "nDup"),
        vencimento: getTagValue(dup, "dVenc")
          ? new Date(getTagValue(dup, "dVenc")).toLocaleDateString("pt-BR")
          : "",
        valor: parseFloat(getTagValue(dup, "vDup")) || 0,
      }))
    : [];

  return {
    chave,
    naturezaOperacao: getTagValue(ide, "natOp"),
    protocoloAutorizacao:
      prot?.getElementsByTagName("nProt")[0]?.textContent || "",
    dataAutorizacao: prot?.getElementsByTagName("dhRecbto")[0]?.textContent
      ? new Date(
          prot.getElementsByTagName("dhRecbto")[0].textContent,
        ).toLocaleString("pt-BR")
      : "",
    dataEmissao: ide?.getElementsByTagName("dhEmi")[0]?.textContent
      ? new Date(
          ide.getElementsByTagName("dhEmi")[0].textContent,
        ).toLocaleDateString("pt-BR")
      : getTagValue(ide, "dEmi"),
    dataSaida: ide?.getElementsByTagName("dhSaiEnt")[0]?.textContent
      ? new Date(
          ide.getElementsByTagName("dhSaiEnt")[0].textContent,
        ).toLocaleDateString("pt-BR")
      : "",
    horaSaida: ide?.getElementsByTagName("dhSaiEnt")[0]?.textContent
      ? new Date(
          ide.getElementsByTagName("dhSaiEnt")[0].textContent,
        ).toLocaleTimeString("pt-BR")
      : "",
    numero: getTagValue(ide, "nNF"),
    serie: getTagValue(ide, "serie"),
    tpNF: getTagValue(ide, "tpNF") === "1" ? "SAÍDA" : "ENTRADA",
    emitente: {
      nome: getTagValue(emit, "xNome"),
      fantasia: getTagValue(emit, "xFant") || getTagValue(emit, "xNome"),
      cnpj: getTagValue(emit, "CNPJ"),
      endereco: (() => {
        const ender = emit.getElementsByTagName("enderEmit")[0];
        return ender
          ? `${getTagValue(ender, "xLgr")}, ${getTagValue(ender, "nro")} ${getTagValue(ender, "xCpl") || ""}`
          : "";
      })(),
      bairro: getTagValue(emit.getElementsByTagName("enderEmit")[0], "xBairro"),
      cep: getTagValue(emit.getElementsByTagName("enderEmit")[0], "CEP"),
      municipio: getTagValue(emit.getElementsByTagName("enderEmit")[0], "xMun"),
      uf: getTagValue(emit.getElementsByTagName("enderEmit")[0], "UF"),
      telefone: getTagValue(emit.getElementsByTagName("enderEmit")[0], "fone"),
      ie: getTagValue(emit, "IE"),
    },
    destinatario: {
      nome: dest ? getTagValue(dest, "xNome") : "CONSUMIDOR FINAL",
      cnpj: dest ? getTagValue(dest, "CNPJ") || getTagValue(dest, "CPF") : "",
      endereco: dest
        ? (() => {
            const enderDest = dest.getElementsByTagName("enderDest")[0];
            return enderDest
              ? `${getTagValue(enderDest, "xLgr")}, ${getTagValue(enderDest, "nro")}`
              : "";
          })()
        : "",
      bairro: dest
        ? getTagValue(dest.getElementsByTagName("enderDest")[0], "xBairro")
        : "",
      cep: dest
        ? getTagValue(dest.getElementsByTagName("enderDest")[0], "CEP")
        : "",
      municipio: dest
        ? getTagValue(dest.getElementsByTagName("enderDest")[0], "xMun")
        : "",
      uf: dest
        ? getTagValue(dest.getElementsByTagName("enderDest")[0], "UF")
        : "",
      ie: dest ? getTagValue(dest, "IE") : "",
    },
    produtos,
    totais: {
      baseICMS: parseFloat(getTagValue(total, "vBC")) || 0,
      valorICMS: parseFloat(getTagValue(total, "vICMS")) || 0,
      valorFrete: parseFloat(getTagValue(total, "vFrete")) || 0,
      valorSeguro: parseFloat(getTagValue(total, "vSeg")) || 0,
      outrasDespesas: parseFloat(getTagValue(total, "vOutro")) || 0,
      valorIPI: parseFloat(getTagValue(total, "vIPI")) || 0,
      valorTotalProdutos: parseFloat(getTagValue(total, "vProd")) || 0,
      valorTotalNota: parseFloat(getTagValue(total, "vNF")) || 0,
    },
    transportador: transporta
      ? {
          nome: getTagValue(transporta, "xNome"),
          cnpj: getTagValue(transporta, "CNPJ"),
          endereco: getTagValue(transporta, "xEnder"),
          municipio: getTagValue(transporta, "xMun"),
          uf: getTagValue(transporta, "UF"),
        }
      : null,
    volumes: vol
      ? {
          quantidade: getTagValue(vol, "qVol"),
          especie: getTagValue(vol, "esp"),
          pesoLiquido: parseFloat(getTagValue(vol, "pesoL")) || 0,
          pesoBruto: parseFloat(getTagValue(vol, "pesoB")) || 0,
        }
      : null,
    duplicatas: dups,
    fatura: cobr?.getElementsByTagName("fat")[0]
      ? {
          numero: getTagValue(cobr.getElementsByTagName("fat")[0], "nFat"),
          valorOriginal:
            parseFloat(
              getTagValue(cobr.getElementsByTagName("fat")[0], "vOrig"),
            ) || 0,
          valorDesconto:
            parseFloat(
              getTagValue(cobr.getElementsByTagName("fat")[0], "vDesc"),
            ) || 0,
          valorLiquido:
            parseFloat(
              getTagValue(cobr.getElementsByTagName("fat")[0], "vLiq"),
            ) || 0,
        }
      : null,
    informacoesComplementares: infAdic ? getTagValue(infAdic, "infCpl") : "",
    observacoesContribuinte: infAdic
      ? Array.from(infAdic.getElementsByTagName("obsCont"))
          .map((obs) => obs.getElementsByTagName("xTexto")[0]?.textContent)
          .filter(Boolean)
      : [],
    localEmbarque: exporta
      ? `${getTagValue(exporta, "xLocExporta")} - ${getTagValue(exporta, "UFSaidaPais")}`
      : "",
  };
};

export const gerarHTMLDanfe = (dados) => {
  const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const produtosLinhas = dados.produtos
    .map(
      (p) => `
    <tr>
      <td>${p.codigo}</td>
      <td>${p.descricao}</td>
      <td>${p.ncm}</td>
      <td>${p.cst || ""}</td>
      <td>${p.cfop}</td>
      <td>${p.unidade}</td>
      <td>${p.quantidade.toFixed(4)}</td>
      <td>${formatarMoeda(p.valorUnitario)}</td>
      <td>${formatarMoeda(p.valorTotal)}</td>
    </tr>
  `,
    )
    .join("");

  const duplicatasLinhas = dados.duplicatas
    .map(
      (d) => `
    <tr><td>${d.numero}</td><td>${d.vencimento}</td><td>${formatarMoeda(d.valor)}</td></tr>
  `,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>DANFE - NFe ${dados.numero}</title>
<style>
  body { font-family: 'Times New Roman', Times, serif; margin: 10px; font-size: 10px; }
  .danfe { max-width: 1100px; margin: 0 auto; border: 1px solid #000; padding: 8px; }
  .header { display: flex; justify-content: space-between; border-bottom: 1px solid #000; margin-bottom: 5px; }
  .title { font-size: 14px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
  th, td { border: 1px solid #000; padding: 2px 4px; vertical-align: top; }
  th { background: #e0e0e0; font-weight: bold; text-align: center; }
  .text-right { text-align: right; }
  .info-box { border: 1px solid #000; padding: 3px; margin-bottom: 5px; }
  .footer { margin-top: 10px; text-align: center; }
  @media print { body { margin: 5px; } .no-print { display: none; } }
</style></head>
<body>
<div class="danfe">
  <div class="header">
    <div><div class="title">DANFE</div>Documento Auxiliar da Nota Fiscal Eletrônica</div>
    <div style="text-align:right;">${dados.tpNF}<br>Nº ${dados.numero} Série ${dados.serie}<br>Folha 1/1</div>
  </div>
  <div class="info-box">
    <strong>Chave de Acesso:</strong> ${dados.chave}<br>
    <strong>Protocolo:</strong> ${dados.protocoloAutorizacao} - ${dados.dataAutorizacao}
  </div>
  <table>
    <tr><th colspan="2">Emitente</th><th colspan="2">Destinatário</th></tr>
    <tr><td>Nome:</td><td>${dados.emitente.nome}</td><td>Nome:</td><td>${dados.destinatario.nome}</td></tr>
    <tr><td>CNPJ:</td><td>${dados.emitente.cnpj}</td><td>CNPJ/CPF:</td><td>${dados.destinatario.cnpj}</td></tr>
    <tr><td>Endereço:</td><td>${dados.emitente.endereco}, ${dados.emitente.bairro}, ${dados.emitente.municipio}-${dados.emitente.uf}, CEP ${dados.emitente.cep}</td>
        <td>Endereço:</td><td>${dados.destinatario.endereco}, ${dados.destinatario.bairro}, ${dados.destinatario.municipio}-${dados.destinatario.uf}, CEP ${dados.destinatario.cep}</td></tr>
    <tr><td>IE:</td><td>${dados.emitente.ie}</td><td>IE:</td><td>${dados.destinatario.ie}</td></tr>
  </table>
  <table>
    <tr><th>Data Emissão</th><th>Data Saída</th><th>Hora Saída</th><th>Natureza Operação</th></tr>
    <tr><td>${dados.dataEmissao}</td><td>${dados.dataSaida}</td><td>${dados.horaSaida}</td><td>${dados.naturezaOperacao}</td></tr>
  </table>
  ${
    dados.fatura
      ? `
  <table><tr><th colspan="3">Fatura</th></tr>
    <tr><td>Número: ${dados.fatura.numero}</td><td>Valor Original: ${formatarMoeda(dados.fatura.valorOriginal)}</td><td>Valor Líquido: ${formatarMoeda(dados.fatura.valorLiquido)}</td></tr>
  </table>`
      : ""
  }
  ${
    dados.duplicatas.length
      ? `
  <table><tr><th>Duplicata</th><th>Vencimento</th><th>Valor</th></tr>${duplicatasLinhas}</table>`
      : ""
  }
  <table>
    <tr><th>Código</th><th>Descrição</th><th>NCM</th><th>CST</th><th>CFOP</th><th>Un</th><th>Qtde</th><th>Vlr Unit</th><th>Vlr Total</th></tr>
    ${produtosLinhas}
  </table>
  <table>
    <tr><th>Base ICMS</th><th>Valor ICMS</th><th>Frete</th><th>Seguro</th><th>Outras Desp</th><th>IPI</th><th>Total Produtos</th><th>Total Nota</th></tr>
    <tr><td>${formatarMoeda(dados.totais.baseICMS)}</td><td>${formatarMoeda(dados.totais.valorICMS)}</td><td>${formatarMoeda(dados.totais.valorFrete)}</td><td>${formatarMoeda(dados.totais.valorSeguro)}</td><td>${formatarMoeda(dados.totais.outrasDespesas)}</td><td>${formatarMoeda(dados.totais.valorIPI)}</td><td>${formatarMoeda(dados.totais.valorTotalProdutos)}</td><td>${formatarMoeda(dados.totais.valorTotalNota)}</td></tr>
  </table>
  ${
    dados.transportador
      ? `
  <table><tr><th colspan="2">Transportador</th></tr>
    <tr><td>Nome: ${dados.transportador.nome}</td><td>CNPJ: ${dados.transportador.cnpj}</td></tr>
    <tr><td colspan="2">Endereço: ${dados.transportador.endereco}, ${dados.transportador.municipio}-${dados.transportador.uf}</td></tr>
    ${dados.volumes ? `<tr><td>Volumes: ${dados.volumes.quantidade} ${dados.volumes.especie}</td><td>Peso Bruto: ${dados.volumes.pesoBruto} kg / Líquido: ${dados.volumes.pesoLiquido} kg</td></tr>` : ""}
  </table>`
      : ""
  }
  <div class="info-box">
    <strong>Informações Complementares:</strong><br>
    ${dados.observacoesContribuinte.map((t) => `• ${t}`).join("<br>")}
    ${dados.informacoesComplementares ? `<br>${dados.informacoesComplementares}` : ""}
  </div>
  <div class="footer no-print">
    <button onclick="window.print()">Imprimir DANFE</button>
  </div>
</div>
</body></html>`;
};

export const abrirDanfe = (xmlString) => {
  try {
    const xmlDoc = parseXMLString(xmlString);
    const dados = extrairDadosNFe(xmlDoc);
    const html = gerarHTMLDanfe(dados);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  } catch (error) {
    alert("Erro ao gerar DANFE: " + error.message);
  }
};
