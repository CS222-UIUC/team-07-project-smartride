import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/context/useAuth";

interface ProtectedRouteProps {
  access: "public" | "auth";
}

const ProtectedRoute = ({ access }: ProtectedRouteProps) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  if (access === "auth" && !isLoggedIn) {
    return <Navigate to="/start" />;
  }

  if (access === "public" && isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
