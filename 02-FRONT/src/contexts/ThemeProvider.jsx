import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "./ThemeContext";
import "../styles/global.css";

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem("tema") || "azul";
  });
  const [modoEscuro, setModoEscuro] = useState(() => {
    const saved = localStorage.getItem("modoEscuro");
    return saved === "true";
  });

  useEffect(() => {
    const html = document.documentElement;

    // Atributo para modo escuro (usado no CSS)
    if (modoEscuro) {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }

    // Atributo para tema de cores (azul, verde, roxo)
    html.setAttribute("data-color-theme", tema);

    // Persiste no localStorage
    localStorage.setItem("modoEscuro", modoEscuro);
    localStorage.setItem("tema", tema);
  }, [modoEscuro, tema]);

  return (
    <ThemeContext.Provider value={{ tema, setTema, modoEscuro, setModoEscuro }}>
      {children}
    </ThemeContext.Provider>
  );
};
ThemeProvider.propTypes = { children: PropTypes.node.isRequired };
/*Código com muitos comentários porque o front foi feito por IA e sou obrigado a utilizar ele a fazer do zero.*/
