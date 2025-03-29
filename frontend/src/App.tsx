import React from "react";
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
import PhoneFrame from "./components/wrappers/PhoneFrame.tsx";
import ProtectedRoute from "./components/wrappers/ProtectedRoute.tsx";
import { AuthProvider } from "./components/context/AuthContext.tsx";


const IsPhone = window.innerWidth < 768; // Flag to determine if the user is on a phone

// Define the routes for the application
const RouteLibrary: React.FC = () => {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<ProtectedRoute access="public"><LoadPage /></ProtectedRoute>} />
      <Route path="/start" element={<ProtectedRoute access="public"><StartPage /></ProtectedRoute>} />
      <Route path="/login" element={<ProtectedRoute access="public"><LoginPage /></ProtectedRoute>} />
      <Route path="/register" element={<ProtectedRoute access="public"><RegisterPage /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute access="public">
        <MapPage
          onMapClick={(point: { lat: number; lng: number }) => {
            console.log("Map clicked at:", point);
            // Or any other logic you want to perform
            // throw new Error("Function not implemented.");
          }}
          selectedPoints={[]}
        />
      </ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute access="auth"><HomePage /></ProtectedRoute>} />
    </Routes>
    </AuthProvider>
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
