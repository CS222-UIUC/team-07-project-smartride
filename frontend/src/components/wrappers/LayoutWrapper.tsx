import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TopBar from "@/components/widgets/TopBar.tsx";
import BottomNav from "@/components/widgets/BottomNav.tsx";

const AUTH_ROOT_PATHS = ["/home", "/map", "/profile"];
const AUTH_SUB_PREFIXES = ["/map/"];

const LayoutWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const isAuthRoot = AUTH_ROOT_PATHS.includes(currentPath);
  const isAuthSub = AUTH_SUB_PREFIXES.some((prefix) =>
    currentPath.startsWith(prefix)
  );

  const activeNavId = AUTH_ROOT_PATHS.find(
    (path) => path === currentPath
  )?.slice(1);

  return (
    <>
      {isAuthSub && (
        <TopBar
          title="Route Planner"
          onBack={() => {
            void navigate("/map");
          }}
        />
      )}
      <div
        className={`
          w-full h-full
          ${isAuthSub ? "pt-[var(--topbar-height)]" : ""}
          ${isAuthRoot ? "pb-[var(--bottomnav-height)]" : ""}
        `}
      >
        <Outlet />
      </div>
      {isAuthRoot && activeNavId && (
        <BottomNav
          active={activeNavId}
          onSelect={(id) => {
            void navigate(`/${id}`);
          }}
        />
      )}
    </>
  );
};

export default LayoutWrapper;
