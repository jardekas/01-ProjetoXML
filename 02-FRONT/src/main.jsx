import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/dashboard.css";
import "./styles/login.css";
import "./styles/usuarios.css";
import "./styles/configuracoes.css";
import "./styles/redefSenha.css";
import "./styles/documentos.css";
import "./styles/sidebar.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
