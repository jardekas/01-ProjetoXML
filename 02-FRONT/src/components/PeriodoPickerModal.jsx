import { useState } from "react";
import PropTypes from "prop-types";

const meses = [
  { value: 0, label: "Janeiro" },
  { value: 1, label: "Fevereiro" },
  { value: 2, label: "Março" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Maio" },
  { value: 5, label: "Junho" },
  { value: 6, label: "Julho" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Setembro" },
  { value: 9, label: "Outubro" },
  { value: 10, label: "Novembro" },
  { value: 11, label: "Dezembro" },
];

const anos = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years;
};

export default function PeriodoPickerModal({ isOpen, onClose, onConfirm }) {
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ mes, ano });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-container--picker"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title" style={{ marginBottom: 16 }}>
          Selecionar Período
        </h2>

        <div className="picker-select-group">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="picker-select picker-select--mes"
          >
            {meses.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="picker-select picker-select--ano"
          >
            {anos().map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

PeriodoPickerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
