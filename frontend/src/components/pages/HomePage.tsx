import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "@/api/services/auth/logout";
import { useState } from "react";
import WeeklySidebar from "./WeeklySidebar.tsx";
import { useAuth } from "@/components/context/useAuth.ts";
import { toast } from "sonner";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      await refresh();
      void navigate("/start");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div
      className="home-container"
      style={{ padding: "20px", textAlign: "center", position: "relative" }}
    >
      {/* top navigation */}
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button
          type="button"
          onClick={toggleMenu}
          style={{ fontSize: "24px", background: "none", border: "none" }}
        >
          ☰
        </button>
      </div>

      {/* sidebar */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "10px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 100,
            textAlign: "left",
          }}
        >
          <button
            type="button"
            onClick={() => void navigate("/profile")}
            style={{
              display: "block",
              marginBottom: "10px",
              background: "none",
              border: "none",
            }}
          >
            Profile
          </button>
          {/* <button onClick={() => navigate("/setting")} style={{ display: "block", background: "none", border: "none" }}>
            Setting
          </button> */}
          <WeeklySidebar />
        </div>
      )}

      <h1>Welcome Home!</h1>
      <p>This is your home page.</p>
      <div className="mt-6 w-full flex flex-col gap-3">
        <Link to="/map">
          <button
            type="button"
            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full"
          >
            Go to Map
          </button>
        </Link>
        <Link to="/ride-log">
          <button
            type="button"
            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full"
          >
            Log a Ride
          </button>
        </Link>
        <button
          type="button"
          onClick={() => {
            void handleLogout();
          }}
          className="px-4 py-2 !bg-red-500 text-white text-sm font-semibold rounded-md shadow transition w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
