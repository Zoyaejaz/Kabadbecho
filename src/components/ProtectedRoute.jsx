import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Redirect to their respective dashboards if they try to access unauthorized pages
      if (userRole === 'ADMIN') {
        navigate("/admin", { replace: true });
      } else if (userRole === 'SCRAP_COLLECTOR') {
        navigate("/Kabadi", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, userRole, allowedRoles, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;