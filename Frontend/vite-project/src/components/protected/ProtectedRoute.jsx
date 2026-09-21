

import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Current location state pass karo direct Navigate me
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;