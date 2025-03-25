import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
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
          </div>
    </div>
  );
};

export default HomePage;
