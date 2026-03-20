// Componente de partículas flutuantes reutilizável
import PropTypes from "prop-types";

const FloatingParticle = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(59, 130, 246, 0.15)",
      animation: "float 8s ease-in-out infinite",
      ...style,
    }}
  />
);

FloatingParticle.propTypes = {
  style: PropTypes.object,
};

export default FloatingParticle;
