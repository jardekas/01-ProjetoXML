import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

//Garda de rota, para impedir que acessem o sistema sem estar logado ou ser um usuário.

export default function PrivateRoute({
  children,
  adminOnly = false,
  masterOnly = false,
  contaOnly = false,
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.flg_admin && !user.flg_master) {
    return <Navigate to="/dashboard" replace />;
  }

  if (masterOnly && !user.flg_master) {
    return <Navigate to="/dashboard" replace />;
  }

  if (contaOnly && !user.flg_conta) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
  masterOnly: PropTypes.bool,
  contaOnly: PropTypes.bool,
};
