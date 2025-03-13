import { useNavigate } from "react-router-dom";
import MapView from "./maps/MapView";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", margin: 0, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderBottom: "1px solid #ccc", zIndex: 1000 }}>
        <button onClick={() => navigate("/")} style={{ fontSize: "16px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer"}}>
          Back
        </button>
      </div>

      <div style={{ position: "relative", width: "100vw", height: "90vh", overflow: "hidden" }}>
        <MapView />
      </div>
    </div>
  );
};

export default MapPage;
