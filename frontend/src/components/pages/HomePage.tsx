import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../authentication/logout";
import { useState } from "react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/start");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div className="home-container" style={{ padding: "20px", textAlign: "center", position: "relative"}}>
      {/* 顶部导航栏 */}
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={toggleMenu} style={{ fontSize: "24px", background: "none", border: "none" }}>
          ☰
        </button>
      </div>

      {/* 侧边栏 */}
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
            textAlign: "left"
          }}
        >
          <button onClick={() => navigate("/profile")} style={{ display: "block", marginBottom: "10px", background: "none", border: "none" }}>
            Profile
          </button>
          {/* <button onClick={() => navigate("/setting")} style={{ display: "block", background: "none", border: "none" }}>
            Setting
          </button> */}
        </div>
      )}




      <h1>Welcome Home!</h1>
      <p>This is your home page.</p>
      <div className="mt-6 w-full flex flex-col gap-3">
        <Link to="/map">
          <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full">
            Go to Map
          </button>
        </Link>
          <Link to="/ride-log">
            <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full">
              Log a Ride
            </button>
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 !bg-red-500 text-white text-sm font-semibold rounded-md shadow transition w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
