import { Navigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  access: "public" | "auth";
}

const ProtectedRoute = ({ children, access }: ProtectedRouteProps) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  if (access === "auth" && !isLoggedIn) {
    return <Navigate to="/start" />;
  }

  return children;
};

export default ProtectedRoute;
