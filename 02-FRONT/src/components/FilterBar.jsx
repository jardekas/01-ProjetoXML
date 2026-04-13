import PropTypes from "prop-types";
import SelectDropdown from "./SelectDropdown";

export default function FilterBar({
  // Props para o Dashboard
  periodo,
  setPeriodo,
  tipo,
  setTipo,
  cliente,
  setCliente,
  periodos,
  tipos,
  clientes,
  onClearFilters,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,

  // Props para a página de Documentos
  busca,
  setBusca,
  numDoc,
  setNumDoc,
  clienteFiltro,
  setClienteFiltro,
  clientesList,
  tipoFiltro,
  setTipoFiltro,
  statusFiltro,
  setStatusFiltro,

  // Props comuns
  openSelect,
  setOpenSelect,
}) {
  // Determina qual layout renderizar baseado nas props recebidas
  const isDashboardLayout = periodo !== undefined && setPeriodo !== undefined;

  if (isDashboardLayout) {
    // Layout do Dashboard
    return (
      <div
        style={{
          background: "white",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          padding: "22px 24px",
          marginBottom: 22,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          animation: "fadeIn 0.4s ease 0.05s both",
          position: "relative",
          zIndex: 50,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 18,
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 700, zIndex: 100 }}>
            Filtros
          </span>
        </div>

        {/* Container flex para Data Início e Data Fim */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Data Início
            </div>
            <input
              type="date"
              className="input-f"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Data Fim
            </div>
            <input
              type="date"
              className="input-f"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-end",
            zIndex: 100,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                zIndex: 100,
                fontSize: 12.5,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Período
            </div>
            <SelectDropdown
              id="periodo"
              value={periodo}
              setValue={setPeriodo}
              options={periodos}
              placeholder="Selecione o período"
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Tipo de Documento
            </div>
            <SelectDropdown
              id="tipo"
              value={tipo}
              setValue={setTipo}
              options={tipos}
              placeholder="Todos os tipos"
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Cliente
            </div>
            <SelectDropdown
              id="cliente"
              value={cliente}
              setValue={setCliente}
              options={clientes}
              placeholder="Selecione um cliente..."
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
            />
          </div>
          <button
            onClick={onClearFilters}
            style={{
              background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              border: "none",
              borderRadius: 9,
              padding: "11px 28px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              color: "white",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(37,99,235,0.22)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 18px rgba(37,99,235,0.32)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(37,99,235,0.22)";
            }}
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    );
  }

  // Layout da página de Documentos
  return (
    <div
      style={{
        background: "white",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        padding: "22px 24px",
        marginBottom: 20,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 18,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
          Filtros
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.6fr 0.8fr 0.8fr",
          gap: 14,
          alignItems: "end",
        }}
      >
        {/* Busca por Chave */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 7,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Buscar Chave
          </div>
          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input-f"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Chave de acesso..."
              style={{
                background: "white",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                padding: "9px 12px 9px 36px",
                fontSize: 13.5,
                width: "100%",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* N° Documento */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 7,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            N° Documento
          </div>
          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input-f"
              value={numDoc}
              onChange={(e) => setNumDoc(e.target.value)}
              placeholder="Número..."
              style={{
                background: "white",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                padding: "9px 12px 9px 36px",
                fontSize: 13.5,
                width: "100%",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Cliente */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 7,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Cliente
          </div>
          <SelectDropdown
            id="clienteFiltro"
            value={clienteFiltro}
            setValue={setClienteFiltro}
            options={[
              { value: "", label: "Todos os clientes" },
              ...(clientesList || []),
            ]}
            placeholder="Selecione um cliente..."
            openSelect={openSelect}
            setOpenSelect={setOpenSelect}
          />
        </div>

        {/* Tipo */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 7,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Tipo
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              style={{
                background: "white",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                padding: "9px 12px",
                fontSize: 13.5,
                width: "100%",
                outline: "none",
                appearance: "none",
              }}
            >
              {["Todos", "NFe", "NFCe", "CTe", "NFSe", "NFCom", "NF3e"].map(
                (t) => (
                  <option key={t}>{t}</option> // alterar a lista de apresentação no arquivo filterBar.jsx.
                ),
              )}
            </select>
            <svg
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Status */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 7,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Status
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              style={{
                background: "white",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                padding: "9px 12px",
                fontSize: 13.5,
                width: "100%",
                outline: "none",
                appearance: "none",
              }}
            >
              {["Todos", "Autorizada", "Com Problema", "Cancelada"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <svg
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  // Props para o Dashboard
  periodo: PropTypes.string,
  setPeriodo: PropTypes.func,
  tipo: PropTypes.string,
  setTipo: PropTypes.func,
  cliente: PropTypes.string,
  setCliente: PropTypes.func,
  periodos: PropTypes.array,
  tipos: PropTypes.array,
  clientes: PropTypes.array,
  onApply: PropTypes.func,
  dataInicio: PropTypes.string,
  setDataInicio: PropTypes.func,
  dataFim: PropTypes.string,
  setDataFim: PropTypes.func,

  // Props para a página de Documentos
  busca: PropTypes.string,
  setBusca: PropTypes.func,
  numDoc: PropTypes.string,
  setNumDoc: PropTypes.func,
  clienteFiltro: PropTypes.string,
  setClienteFiltro: PropTypes.func,
  clientesList: PropTypes.array,
  tipoFiltro: PropTypes.string,
  setTipoFiltro: PropTypes.func,
  statusFiltro: PropTypes.string,
  setStatusFiltro: PropTypes.func,
  onClearFilters: PropTypes.func,

  // Props comuns
  openSelect: PropTypes.string,
  setOpenSelect: PropTypes.func,
  setFiltrosAbertos: PropTypes.func,
};
