export const formatarData = (dataStr) => {
  if (!dataStr) return "";
  const [dia, mes, ano] = dataStr.split("/");
  return `${dia}/${mes}/${ano}`;
};

export const formatarMoeda = (valor) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const gerarHTMLRelatorio = (
  documentos,
  periodoInicio,
  periodoFim,
  userType,
) => {
  const isContador = userType === "contador" || userType === "master";

  const titulo = isContador
    ? "Nota Fiscal Eletrônica - Por XML (Visão Contador)"
    : "Nota Fiscal Eletrônica - Por XML";

  const labelNome = isContador ? "EMITENTE" : "CLIENTE/FORNECEDOR";

  // Agrupar documentos por data
  const documentosPorData = {};
  documentos.forEach((doc) => {
    const data = doc.data || "—";
    if (!documentosPorData[data]) {
      documentosPorData[data] = [];
    }
    documentosPorData[data].push(doc);
  });

  // Ordenar as datas (considerando formato DD/MM/AAAA)
  const datasOrdenadas = Object.keys(documentosPorData).sort((a, b) => {
    if (a === "—") return 1;
    if (b === "—") return -1;
    const [diaA, mesA, anoA] = a.split("/");
    const [diaB, mesB, anoB] = b.split("/");
    return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
  });

  let linhas = "";
  let totalGeral = 0;
  let totalDocumentos = 0;

  datasOrdenadas.forEach((data, dataIndex) => {
    const docsDoDia = documentosPorData[data];
    let totalDia = 0;
    let qtdDia = 0;

    docsDoDia.forEach((doc, i) => {
      const tipo = doc.tipo || "—";
      const status = doc.status || "—";
      const numero = doc.numero || "—";
      const nome = doc.cliente || "—";
      const cnpj = doc.clienteCNPJ || "—";
      const valor = doc.valor || 0;
      totalDia += valor;
      qtdDia++;
      totalGeral += valor;
      totalDocumentos++;

      const classe = i % 2 === 0 ? "linha-par" : "linha-impar";

      linhas += `
      <tr class="${classe}">
        <td class="col-tipo">${tipo}</td>
        <td class="col-status">${status}</td>
        <td class="col-data">${data}</td>
        <td class="col-doc">${numero}</td>
        <td class="col-nome">${nome}</td>
        <td class="col-cnpj">${cnpj}</td>
        <td class="col-valor">${formatarMoeda(valor)}</td>
      </tr>
    `;
    });

    // Linha de total do dia
    const classeDia = dataIndex % 2 === 0 ? "total-dia-par" : "total-dia-impar";
    linhas += `
      <tr class="total-dia-row ${classeDia}">
        <td colspan="6" style="text-align:right; padding-right:12px; font-weight:700;">
          TOTAL DO DIA ${data} (${qtdDia} documentos)
        </td>
        <td class="col-valor" style="font-weight:700;">${formatarMoeda(totalDia)}</td>
      </tr>
    `;
  });

  const totalFormatado = formatarMoeda(totalGeral);
  const quantidade = documentos.length;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Fiscal</title>
      <style>
      
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          color: #1a1a1a;
          background: #fff;
          padding: 20px 24px;
        }

        .header {
          padding-bottom: 2px;
          margin-bottom: 4px;
        }

        .header h2 {
          font-size: 15px;
          font-weight: 700;
          color: #555;
          margin-bottom: 4px;
        }

        .header p {
          font-size: 11px;
          color: #555;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
        }

        thead tr {
          background: #576cc8;
          color: #fff;
        }

        th {
          padding: 7px 8px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          border: 1px solid #1a3a8f;
        }

        td {
          padding: 6px 8px;
          font-size: 10.5px;
          border: 1px solid #e2e8f0;
          vertical-align: middle;
          word-break: break-word;
        }

        .linha-par td {
          background: #ffffff !important;
        }

        .linha-impar td {
          background: #f2f2f2 !important;
        }

        /* Totalizador por dia - tons de verde */
        .total-dia-par td {
          background: #d4edda !important;
          font-weight: 700;
          border-top: 2px solid #28a745;
        }

        .total-dia-impar td {
          background: #c3e6cb !important;
          font-weight: 700;
          border-top: 2px solid #28a745;
        }

        /* Larguras fixas e previsíveis */
        .col-tipo   { width: 55px; }
        .col-status { width: 85px; }
        .col-data   { width: 80px; }
        .col-doc    { width: 100px; text-align: center; }
        .col-nome   { width: 220px; }
        .col-cnpj   { width: 120px; }
        .col-valor  { width: 95px; text-align: right; }

        th.col-doc   { text-align: center; }
        th.col-valor { text-align: right; }

        tr {
          page-break-inside: avoid;
        }

        /* Total geral - tom de azul */
        .total-geral-row td {
          font-weight: 700;
          background: #e8f0fe !important;
          border-top: 3px solid #576cc8;
          font-size: 12px;
        }

        .footer {
          margin-top: 14px;
          font-size: 10px;
          color: #666;
          display: flex;
          justify-content: space-between;
        }

        @media print {

          body { padding: 10mm 12mm; }

          table { page-break-inside: auto; }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          thead {
            display: table-header-group;
          }
        }
      </style>
    </head>

    <body>
      <div class="header">
        <h2>Totalizador Fiscal: ${titulo}</h2>
        <p>
          Período: ${periodoInicio} a ${periodoFim}
          &nbsp;|&nbsp;
          Gerado em: ${new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th class="col-tipo">TIPO</th>
            <th class="col-status">STATUS</th>
            <th class="col-data">DATA</th>
            <th class="col-doc">DOCUMENTO</th>
            <th class="col-nome">${labelNome}</th>
            <th class="col-cnpj">CNPJ</th>
            <th class="col-valor">VALOR</th>
          </tr>
        </thead>

        <tbody>
          ${linhas}

          <tr class="total-geral-row">
            <td colspan="6" style="text-align:right; padding-right:12px;">
              TOTAL GERAL (${quantidade} documentos)
            </td>
            <td class="col-valor">${totalFormatado}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <span>Quantidade de notas: <strong>${quantidade}</strong></span>
        <span>Portal Contador — Gestão Fiscal</span>
      </div>
    </body>
    </html>
  `;
};
