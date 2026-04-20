import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
