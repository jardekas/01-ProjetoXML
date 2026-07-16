import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import KPICard from "../components/KPICard";
import FilterBar from "../components/FilterBar";
import BarChartComponent from "../components/Charts/BarChartComponent";
import PieChartComponent from "../components/Charts/PieChartComponent";
import {
  dashboardService,
  PERIODOS,
  TIPOS,
  LEGEND_ITEMS,
} from "../services/dashboardService.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), 0, 1);
  const [dataInicio, setDataInicio] = useState(
    primeiroDiaMes.toISOString().slice(0, 10),
  );
  const [dataFim, setDataFim] = useState(hoje.toISOString().slice(0, 10));
  const [tipo, setTipo] = useState("Todos os tipos");
  const [cliente, setCliente] = useState("");
  const [openSelect, setOpenSelect] = useState(null);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [periodo, setPeriodo] = useState("");

  const handleClearFilters = () => {
    setDataInicio(primeiroDiaMes.toISOString().slice(0, 10));
    setDataFim(hoje.toISOString().slice(0, 10));
    setTipo("Todos os tipos");
    setCliente("");
    setPeriodo("");
  };
  const requestIdRef = useRef(0);

  const loadDados = useCallback(() => {
    const isContador = user?.flg_conta && user?.idContador;
    if (!isContador && !user?.EMPcpfCNPJ) return;
    if (!dataInicio || !dataFim) return;
    if (dataInicio.length < 10 || dataFim.length < 10) return;
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    dashboardService
      .getDados(user, dataInicio, dataFim, tipo, cliente)
      .then(({ barData, pieData, kpiData, clientes }) => {
        setBarData(barData);
        setPieData(pieData);
        setKpiData(kpiData);
        setClientes(clientes);
      })
      .catch(console.error)
      .finally(() => {
        if (currentRequestId === requestIdRef.current) setLoading(false);
      });
  }, [user, dataInicio, dataFim, tipo, cliente]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDados();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [loadDados]);

  return (
    <div className="dashboard-container" onClick={() => setOpenSelect(null)}>
      <main className="dashboard-main">
        <FilterBar
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
          periodo={periodo}
          setPeriodo={setPeriodo}
          periodos={PERIODOS}
          tipo={tipo}
          setTipo={setTipo}
          cliente={cliente}
          setCliente={setCliente}
          openSelect={openSelect}
          setOpenSelect={setOpenSelect}
          tipos={TIPOS}
          clientes={clientes}
          onApply={loadDados}
          onClearFilters={handleClearFilters}
        />

        <div className="kpi-grid">
          {kpiData.map((kpi, i) => (
            <KPICard key={kpi.label} {...kpi} delay={0.1 + i * 0.05} />
          ))}
        </div>

        {loading ? (
          <div className="loading-placeholder">Carregando gráficos...</div>
        ) : (
          <div className="charts-grid">
            <BarChartComponent data={barData} legendItems={LEGEND_ITEMS} />
            <PieChartComponent data={pieData} />
          </div>
        )}
      </main>
    </div>
  );
}
