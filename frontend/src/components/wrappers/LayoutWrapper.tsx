import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TopBar from "@/components/widgets/TopBar";
import BottomNav from "@/components/widgets/BottomNav";

const AUTH_ROOT_PATHS = ["/home", "/map", "/profile"];
const AUTH_SUB_PREFIXES = ["/map/"];

const LayoutWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  // 判断是否为主页面（显示 BottomNav）
  const isAuthRoot = AUTH_ROOT_PATHS.includes(currentPath);

  // 判断是否为子页面（显示 TopBar）
  const isAuthSub = AUTH_SUB_PREFIXES.some((prefix) =>
    currentPath.startsWith(prefix),
  );

  // 从路径反推 active nav id
  const activeNavId = AUTH_ROOT_PATHS.find(
    (path) => path === currentPath,
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
      <Outlet />
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
