import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  if (!isAuthenticated) {

    localStorage.setItem(
      "redirectAfterLogin",
      location.pathname
    );

    return <Navigate to="/signup" replace />;
  }

  return children;
}

export default ProtectedRoute;


