import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-page)",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          background: "var(--bg-page)",
          overflow: "auto",
          padding: 0,
        }}
      >
        <Outlet /> {/* Renderiza a página atual */}
      </main>
    </div>
  );
}
