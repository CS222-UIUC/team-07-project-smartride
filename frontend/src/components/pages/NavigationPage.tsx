import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/maps/MapWrapper";
import { useNavController } from "@/features/map/nav/controller";
// import { getWeather, WeatherData } from "@/api/services/omt/get_weather";

const NavigationPage = () => {
  const navigate = useNavigate();
  const { getMapBindings, flatCoords/*, userPosition*/ } = useNavController();

  const [hasInjected, setHasInjected] = useState(false);

  const [searchParams] = useSearchParams();
  // TODO
  const routeId = parseInt(searchParams.get("id") ?? "-1");

  useEffect(() => {
    if (flatCoords.length > 0) {
      setHasInjected(true);
    }
  }, [flatCoords]);

  // ========== TEST WEATHER API ==========
  // useEffect(() => {
  //   const fetchWeather = async () => {
  //     if (!userPosition) return;
  //     if (Array.isArray(userPosition)) {
  //       const [lat, lng] = userPosition;
  //       try {
  //         const weather: WeatherData = await getWeather(lat, lng);
  //         console.log("Weather data:", weather);
  //       } catch (err) {
  //         console.error("Weather fetch failed:", err);
  //       }
  //     };
  //   }
  //   void fetchWeather();
  // }, [userPosition]);

  if (!hasInjected) {
    return <div>Loading route...</div>;
  }

  return (
    <div className="absolute inset-0">
      <MapWrapper bindings={getMapBindings()}/>
      <Button
        onClick={() => {
          void navigate(`/ride-log?routeId=${routeId.toString()}`);
        }}
        className="bg-green-600 hover:bg-green-700 text-black px-6 py-2 rounded-md shadow-md"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        Complete Ride and Log
      </Button>

      <Button
        onClick={() => {
          if (routeId !== -1) {
            void navigate(`/map/plan?id=${routeId.toString()}`);
          } else {
            void navigate("/map/plan");
          }
        }}
        className="bg-red-600 hover:bg-red-700 text-black px-6 py-2 rounded-md shadow-md absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50"
      >
        Exit Navigation
      </Button>
    </div>
  );
};

export default NavigationPage;
