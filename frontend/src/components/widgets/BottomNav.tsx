import { Home, Map, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { id: "home", icon: <Home />, label: "Home" },
  { id: "map", icon: <Map />, label: "Map" },
  { id: "profile", icon: <User />, label: "Profile" },
];

const BottomNav = ({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-16 bg-white shadow-md flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            onSelect(item.id);
          }}
          className="relative flex flex-col items-center justify-center"
        >
          {item.icon}
          <span className="text-xs mt-0.5">{item.label}</span>
          {active === item.id && (
            <motion.div
              layoutId="nav-underline"
              className="absolute bottom-0 h-1 w-6 rounded-full bg-green-500"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
