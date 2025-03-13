import { useNavigate } from "react-router-dom";
import MapView from "./maps/MapView";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: "8px 12px",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
      <MapView />
    </div>
  );
};

export default MapPage;
