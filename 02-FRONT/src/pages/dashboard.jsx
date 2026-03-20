import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import KPICard from "../components/KPICard";
import FilterBar from "../components/FilterBar";
import BarChartComponent from "../components/Charts/BarChartComponent";
import PieChartComponent from "../components/Charts/PieChartComponent";
import {
  dashboardService,
  PERIODOS,
  TIPOS,
  CLIENTES,
  LEGEND_ITEMS,
} from "../services/dashboardService.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [periodo, setPeriodo] = useState("");
  const [tipo, setTipo] = useState("Todos os tipos");
  const [cliente, setCliente] = useState("");
  const [openSelect, setOpenSelect] = useState(null);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);

  const handleClearFilters = () => {
    setPeriodo("");
    setTipo("Todos os tipos");
    setCliente("");
  };

  const loadDados = useCallback(() => {
    const isContador = user?.flg_conta && user?.idContador;
    if (!isContador && !user?.EMPcpfCNPJ) return;
    setLoading(true);
    dashboardService
      .getDados(user, periodo, tipo, cliente)
      .then(({ barData, pieData, kpiData, clientes }) => {
        setBarData(barData);
        setPieData(pieData);
        setKpiData(kpiData);
        setClientes(clientes); // Reseta o cliente ao carregar novos dados
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, periodo, tipo, cliente]);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  return (
    <div className="dashboard-container" onClick={() => setOpenSelect(null)}>
      {/* ...style igual... */}
      <main
        style={{
          flex: 1,
          padding: "32px 36px",
          overflowY: "auto",
          zIndex: 100,
          minWidth: 0,
        }}
      >
        {/* Header igual */}

        <FilterBar
          periodo={periodo}
          setPeriodo={setPeriodo}
          tipo={tipo}
          setTipo={setTipo}
          cliente={cliente}
          setCliente={setCliente}
          openSelect={openSelect}
          setOpenSelect={setOpenSelect}
          periodos={PERIODOS}
          tipos={TIPOS}
          clientes={clientes}
          onApply={loadDados}
          onClearFilters={handleClearFilters}
        />

        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 22,
          }}
        >
          {kpiData.map((kpi, i) => (
            <KPICard key={kpi.label} {...kpi} delay={0.1 + i * 0.05} />
          ))}
        </div>

        {/* Charts */}
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
            Carregando gráficos...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr",
              gap: 20,
            }}
          >
            <BarChartComponent data={barData} legendItems={LEGEND_ITEMS} />
            <PieChartComponent data={pieData} />
          </div>
        )}
      </main>
    </div>
  );
}
