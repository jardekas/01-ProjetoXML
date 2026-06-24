import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/documentos.css";
import { gerarHTMLDanfe, parsearXMLParaDados } from "../utils/danfeUtils";

export default function DanfeModal({ isOpen, onClose, xmlString }) {
  const [iframeReady, setIframeReady] = useState(false);
  const [erro, setErro] = useState(null);
  const [imprimindo, setImprimindo] = useState(false);
  const [dadosNFe, setDadosNFe] = useState(null);
  const iframeRef = useRef(null);

  // Gera dados e HTML ao abrir com um novo xmlString
  useEffect(() => {
    if (!isOpen || !xmlString) return;

    setIframeReady(false);
    setErro(null);
    setDadosNFe(null);

    try {
      console.log(xmlString);
      const dados = parsearXMLParaDados(xmlString);
      setDadosNFe(dados);
    } catch (e) {
      console.error(e);
      setErro("Erro ao processar XML: " + e.message);
    }
  }, [isOpen, xmlString]);

  // Injeta HTML no iframe quando os dados estiverem prontos
  useEffect(() => {
    if (!isOpen || !dadosNFe || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const html = gerarHTMLDanfe(dadosNFe);

    const handleLoad = () => setIframeReady(true);
    iframe.addEventListener("load", handleLoad);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Fallback: readyState já completo antes do evento disparar
    if (iframeDoc.readyState === "complete") setIframeReady(true);

    return () => iframe.removeEventListener("load", handleLoad);
  }, [isOpen, dadosNFe]);

  const handleImprimir = () => {
    if (!iframeRef.current || !iframeReady) return;
    setImprimindo(true);
    iframeRef.current.contentWindow.focus();
    iframeRef.current.contentWindow.print();
    setTimeout(() => setImprimindo(false), 800);
  };

  if (!isOpen) return null;

  const nfLabel = dadosNFe
    ? `NF-e ${dadosNFe.numero} · ${dadosNFe.emitente.nome}`
    : "Carregando...";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-container--impress"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header modal-header--impress">
          <div style={{ width: "100%" }}>
            <h2 className="modal-title">DANFE</h2>
            <p className="modal-desc">
              {erro ? "Erro no processamento" : nfLabel}
            </p>
          </div>
        </div>

        <div className="impress-preview-container">
          {erro ? (
            <div className="danfe-erro">
              <span>⚠️ {erro}</span>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="danfe-preview"
              className="impress-preview-iframe"
            />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "5rem" }}>
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={imprimindo}
          >
            Fechar
          </button>

          {!erro && (
            <button
              className="impress-btn"
              onClick={handleImprimir}
              disabled={!iframeReady || imprimindo}
            >
              {imprimindo
                ? "Abrindo impressão..."
                : !iframeReady
                  ? "Carregando..."
                  : "Imprimir / Salvar PDF"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

DanfeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  /** String com o conteúdo do arquivo XML da NF-e */
  xmlString: PropTypes.string.isRequired,
};
