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
  userType, // "contador" | "empresa"
) => {
  const titulo =
    userType === "contador"
      ? "Nota Fiscal Eletrônica - Por XML (Visão Contador)"
      : "Nota Fiscal Eletrônica - Por XML";

  const colunas =
    userType === "contador"
      ? ["TIPO", "STATUS", "DATA", "DOCUMENTO", "EMITENTE", "VALOR"]
      : ["TIPO", "STATUS", "DATA", "DOCUMENTO", "CLIENTE/FORNECEDOR", "VALOR"];

  let linhas = "";
  let totalValor = 0;

  documentos.forEach((doc) => {
    const tipo = doc.tipo || "";
    const status = doc.status || "";
    const data = doc.data || "";
    const numero = doc.numero || "";
    const nome =
      userType === "contador"
        ? doc.cliente // que é o nomeEmp para contador
        : doc.cliente; // que é nomeCli para empresa
    const valor = doc.valor || 0;
    totalValor += valor;

    linhas += `
      <tr>
        <td>${tipo}</td>
        <td>${status}</td>
        <td>${data}</td>
        <td>${numero}</td>
        <td>${nome}</td>
        <td style="text-align: right;">${formatarMoeda(valor)}</td>
      </tr>
    `;
  });

  const totalFormatado = formatarMoeda(totalValor);
  const quantidade = documentos.length;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Fiscal</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          margin: 30px;
          color: #000;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
        }
        .periodo {
          text-align: right;
          font-size: 14px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #000;
          padding: 5px 8px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .total-row {
          font-weight: bold;
          background-color: #e0e0e0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
        }
        @media print {
          body { margin: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Totalizador Fiscal: ${titulo}</h2>
        <p>Período: ${periodoInicio} a ${periodoFim}</p>
      </div>
      <table>
        <thead>
          <tr>
            ${colunas.map((c) => `<th>${c}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${linhas}
          <tr class="total-row">
            <td colspan="5" style="text-align: right;">TOTAL</td>
            <td style="text-align: right;">${totalFormatado}</td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <p>Quantidade de notas: ${quantidade}</p>
        <p>Data de emissão: ${new Date().toLocaleDateString("pt-BR")}</p>
      </div>
    </body>
    </html>
  `;
};
