import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

export function useNavigation() {
  const navigate = useNavigate();

  const goTo = (routeKey, params = {}) => {
    const route = ROUTES[routeKey];
    if (route) {
      // Se tiver parâmetros na rota (ex: /clientes/:id)
      let path = route.path;
      Object.keys(params).forEach((key) => {
        path = path.replace(`:${key}`, params[key]);
      });
      navigate(path);
    }
  };

  const goBack = () => navigate(-1);
  const goHome = () => navigate(ROUTES.DASHBOARD.path);

  return { goTo, goBack, goHome, ROUTES };
}
