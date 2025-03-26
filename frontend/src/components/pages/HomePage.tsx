import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../authentication/logout";

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

  return (
    <div className="home-container" style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome Home!</h1>
      <p>This is your home page.</p>
      <div className="mt-6 w-full flex flex-col gap-3">
        <Link to="/map">
          <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow transition w-full">
            Go to Map
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
