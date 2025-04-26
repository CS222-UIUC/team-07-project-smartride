import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/components/pages/LoginPage.tsx";
import RegisterPage from "@/components/pages/RegisterPage.tsx";
import HomePage from "@/components/pages/HomePage.tsx";
import StartPage from "@/components/pages/StartPage.tsx";
import LoadPage from "@/components/pages/LoadPage.tsx";
import MapPage from "@/components/pages/MapPage.tsx";
import RoutePlanningPage from "@/components/pages/RoutePlanningPage.tsx";
import NavigationPage from "@/components/pages/NavigationPage.tsx";
import ProfilePage from "@/components/pages/ProfilePage.js";
import RideLogPage from "@/components/pages/RideLogPage.tsx";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute.tsx";
import { AuthProvider } from "@/components/context/AuthProvider.tsx";
import { PhoneContext } from "@/components/context/PhoneContext.tsx";
import PhoneFrame from "@/components/wrappers/PhoneFrame.tsx";
import LayoutWrapper from "@/components/wrappers/LayoutWrapper.tsx";
import "@/index.css";
import "@/App.css";
import DayRoutePage from "@/components/pages/DayRoutePage.tsx";
import { Toaster } from "sonner";

const IsPhone = window.innerWidth < 768;

const RouteLibrary: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute access="public" />}>
          <Route path="/" element={<LoadPage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute access="auth" />}>
          <Route element={<LayoutWrapper />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/map/plan" element={<RoutePlanningPage />} />
            <Route path="/map/navigation" element={<NavigationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ride-log" element={<RideLogPage />} />
            <Route path="/route/:day" element={<DayRoutePage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  const content = <RouteLibrary />;
  return (
    <>
      <PhoneContext value={IsPhone}>
        {IsPhone ? <PhoneFrame>{content}</PhoneFrame> : content}
      </PhoneContext>
      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;
