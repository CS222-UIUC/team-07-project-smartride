import React, {ReactNode} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import LoginPage from "./pages/LoginPage.tsx";
import "./App.css";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {/* Logo (Designed later) */}
      <div className="flex gap-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} 
              style={{ width: "90px", height: "auto" }} 
              alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} 
              style={{ width: "90px", height: "auto" }}  
              alt="React logo" />
        </a>
        {/* <a target="_blank">
          <img 
            src="https://howtodrawforkids.com/wp-content/uploads/2022/01/9-kid-on-a-bike-drawing-tutorial-step-by-step.jpg"
            style={{ width: "90px", height: "auto" }}  
            alt="Bike logo" />
        </a> */}
      </div>

      {/* Description */}
      <h1 className="text-5xl font-bold mt-6">Vite + React</h1>
      <h2 className="text-2xl font-semibold mt-2">Web Mobile Cycling App</h2>
      <p className="text-lg text-gray-200 mt-4 text-center">
        Welcome to SmartRide. Click below to Login.
      </p>

      {/* Login Button */}
      <Link to="/login">
        <button className="mt-6 px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition">
          Go to Login
        </button>
      </Link>
    </div>
  );
};


// Design a Web Mobile Phone Frame
const PhoneFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="phone-frame">
      <div className="screen">{children}</div>
    </div>
  );
};

// Main application component. Defines the overall structure and routing.
const App: React.FC = () => {
  return (
    <PhoneFrame>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </PhoneFrame>
  );
};

export default App;