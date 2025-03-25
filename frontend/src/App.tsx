import React, {ReactNode} from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./components/MapPage";
import LoginPage from "./components/LoginPage.tsx";
import HomePage from "./components/HomePage.tsx";
import StartPage from "./components/StartPage.tsx"
import "./index.css";
import './App.css';

// A test flag to determine if the application is running on a phone
const IsPhone = true;

// Design a Web Mobile Phone Frame
const PhoneFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="phone-frame">
      <div className="screen">{children}</div>
    </div>
  );
};

// Define the routes for the application
const RouteLibrary: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/home" element = {<HomePage/>} />
    </Routes>
  );
}

// Main application component.
const App: React.FC = () => {
  if (!IsPhone) {
    return (
      <RouteLibrary />
    );
  }
  return (
    <PhoneFrame>
      <RouteLibrary />
    </PhoneFrame>
  );
};

export default App;
