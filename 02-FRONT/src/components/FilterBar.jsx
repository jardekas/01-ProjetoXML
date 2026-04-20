import PropTypes from "prop-types";
import SelectDropdown from "./SelectDropdown";

export default function FilterBar({
  periodo,
  setPeriodo,
  tipo,
  setTipo,
  cliente,
  setCliente,
  tipos,
  clientes,
  onClearFilters,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
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
  openSelect,
  setOpenSelect,
}) {
  const isDashboardLayout = periodo !== undefined && setPeriodo !== undefined;

  if (isDashboardLayout) {
    return (
      <div
        className="filter-bar filter-bar--dashboard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-bar__header">
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
          <span>Filtros</span>
        </div>
        <div className="filter-bar__row">
          <div className="filter-bar__control-group">
            <div className="filter-bar__control-label">Tipo de Documento</div>
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
          <div className="filter-bar__date-group">
            <div className="filter-bar__date-label">Data Início</div>
            <input
              type="date"
              className="input-f"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="filter-bar__date-group">
            <div className="filter-bar__date-label">Data Fim</div>
            <input
              type="date"
              className="input-f"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-bar__controls-row">
          <div className="filter-bar__control-group">
            <div className="filter-bar__control-label">Cliente</div>
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
          <button className="btn-clear-filters" onClick={onClearFilters}>
            Limpar Filtros
          </button>
        </div>
      </div>
    );
  }

  // Layout Documentos
  return (
    <div className="filter-bar filter-bar--docs">
      <div className="filter-bar__header">
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
        <span>Filtros</span>
      </div>

      <div className="filter-docs-grid">
        <div className="filter-docs-field">
          <div className="filter-docs-label">Buscar Chave</div>
          <div className="filter-docs-search-wrapper">
            <svg
              className="filter-docs-search-icon"
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
              className="filter-docs-search-input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Chave de acesso..."
            />
          </div>
        </div>

        <div className="filter-docs-field">
          <div className="filter-docs-label">N° Documento</div>
          <div className="filter-docs-search-wrapper">
            <svg
              className="filter-docs-search-icon"
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
              className="filter-docs-search-input"
              value={numDoc}
              onChange={(e) => setNumDoc(e.target.value)}
              placeholder="Número..."
            />
          </div>
        </div>

        <div className="filter-docs-field">
          <div className="filter-docs-label">Cliente</div>
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

        <div className="filter-docs-field">
          <div className="filter-docs-label">Tipo</div>
          <div className="filter-docs-select-wrapper">
            <select
              className="select-f"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              {["Todos", "NFe", "NFCe", "CTe", "NFSe", "NFCom", "NF3e"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
            <svg
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

        <div className="filter-docs-field">
          <div className="filter-docs-label">Status</div>
          <div className="filter-docs-select-wrapper">
            <select
              className="select-f"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              {["Todos", "Autorizada", "Com Problema", "Cancelada"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <svg
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
