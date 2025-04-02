import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: React.ReactNode;
  requiredRole?: "admin";
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role?.name;

  if (requiredRole === "admin" && roleName !== "admin" && roleName !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}