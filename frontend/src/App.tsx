import React, {ReactNode} from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./components/MapPage";
import LoginPage from "./components/LoginPage.tsx";
import HomePage from "./components/HomePage.tsx";
import StartPage from "./components/StartPage.tsx"
import "./index.css";
import './App.css';


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
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/home" element = {<HomePage/>} />
        </Routes>
    </PhoneFrame>
  );
};

export default App;
