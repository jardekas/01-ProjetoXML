import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components.css";

export default function SelectDropdown({
  id,
  value,
  setValue,
  options,
  placeholder,
  openSelect,
  setOpenSelect,
}) {
  const [search, setSearch] = useState("");
  const isOpen = openSelect === id;

  const handleToggle = (e) => {
    e.stopPropagation();

    if (isOpen) {
      setSearch("");
      setOpenSelect(null);
    } else {
      setSearch("");
      setOpenSelect(id);
    }
  };

  const handleOptionClick = (option) => (e) => {
    e.stopPropagation();

    const newValue = typeof option === "object" ? option.value : option;

    setValue(newValue);
    setSearch("");
    setOpenSelect(null);
  };

  const getDisplayLabel = () => {
    if (!value) return placeholder;

    const selectedOption = options.find((opt) =>
      typeof opt === "object" ? opt.value === value : opt === value,
    );

    if (selectedOption) {
      return typeof selectedOption === "object"
        ? selectedOption.label
        : selectedOption;
    }
    return value;
  };

  const filteredOptions = options.filter((opt) => {
    const label = typeof opt === "object" ? opt.label : opt;

    return label.toLowerCase().includes(search.toLowerCase());
  });

  const displayLabel = getDisplayLabel();
  const isPlaceholder = !value;

  return (
    <div className="select-dropdown">
      <button
        type="button"
        onClick={handleToggle}
        className={`select-dropdown__button ${
          isOpen ? "select-dropdown__button--open" : ""
        } ${isPlaceholder ? "select-dropdown__button--placeholder" : ""}`}
      >
        <span>{displayLabel}</span>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? "#1d4ed8" : "#94a3b8"}
          strokeWidth="2.5"
          className={`select-dropdown__icon ${
            isOpen ? "select-dropdown__icon--open" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="select-dropdown__menu"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="select-dropdown__search"
            onClick={(e) => e.stopPropagation()}
          />

          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const optValue = typeof opt === "object" ? opt.value : opt;

              const optLabel = typeof opt === "object" ? opt.label : opt;

              const isSelected = value === optValue;

              return (
                <div
                  key={optValue}
                  onClick={handleOptionClick(opt)}
                  className={`select-dropdown__option ${
                    isSelected ? "select-dropdown__option--selected" : ""
                  }`}
                >
                  {optLabel}
                </div>
              );
            })
          ) : (
            <div className="select-dropdown__option">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}

SelectDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ]),
  ).isRequired,
  placeholder: PropTypes.string.isRequired,
  openSelect: PropTypes.string,
  setOpenSelect: PropTypes.func.isRequired,
};
