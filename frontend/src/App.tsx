import React, {ReactNode} from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./components/MapPage";
import LoginPage from "./components/LoginPage.tsx";
import HomePage from "./components/HomePage";
import "./index.css";
import './App.css';

const IsPhone = true;

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
  if (!IsPhone) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    );
  }
  return (
    <PhoneFrame>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
    </PhoneFrame>
  );
};

export default App;
