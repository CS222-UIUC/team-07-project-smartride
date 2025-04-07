interface ProtectedRouteProps {
    access: "public" | "auth";
}
declare const ProtectedRoute: ({ access }: ProtectedRouteProps) => import("react/jsx-runtime").JSX.Element | null;
export default ProtectedRoute;
