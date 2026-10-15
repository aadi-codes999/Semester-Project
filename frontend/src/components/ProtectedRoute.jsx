import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

export default function ProtectedRoute() {
  if (!API_ENABLED) return <Outlet />;
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
