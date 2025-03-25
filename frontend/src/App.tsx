import React, {ReactNode} from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./components/pages/MapPage.tsx";
import LoginPage from "./components/pages/LoginPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import StartPage from "./components/pages/StartPage.tsx"
import LoadPage from "./components/pages/LoadPage.tsx";
import "./index.css";
import './App.css';
import { PhoneContext } from "./components/context/PhoneContext.tsx";


const IsPhone = window.innerWidth < 768; // Flag to determine if the user is on a phone

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
      <Route path="/" element={<LoadPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/home" element = {<HomePage/>} />
    </Routes>
  );
}

// Main application component.
const App: React.FC = () => {
  const content = <RouteLibrary />;

  return (
    <PhoneContext.Provider value={IsPhone}>
      {IsPhone ? <PhoneFrame>{content}</PhoneFrame> : content}
    </PhoneContext.Provider>
  );
};

export default App;
