import { useNavigate } from "react-router-dom";
import MapView from "../maps/MapView";

import { CSSProperties } from "react";
import { useIsPhone } from "../context/PhoneContext";


const MapWrapper = () => {
  const IsPhone = useIsPhone();
  const style: CSSProperties = IsPhone
    ? { width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }
    : { width: "60%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center" };

  return (
    <div style={style}>
      <MapView />
    </div>
  );
};


const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>
      <div style={{ width: "60%", margin: "1rem" }}>
        <button
          onClick={() => navigate("/")}
          className="w-full text-base bg-gray-100 border border-gray-300 rounded-lg cursor-pointer"
        >
          Back
        </button>
      </div>
      <MapWrapper />
    </div>
  );
};

export default MapPage;
