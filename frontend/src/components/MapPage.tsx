import { useNavigate } from "react-router-dom";
// import MapView from "./maps/MapView";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", margin: 0, padding: 0, overflow: "hidden", backgroundColor: "#f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, width: "100%"}}>
        <button onClick={() => navigate("/")} style={{ fontSize: "16px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", width: "100%"}}>
          Back
        </button>
      </div>
{/* 
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", width: "100vw", height: "90vh", overflow: "hidden" }}>
        <MapView />
      </div> */}
    </div>
  );
};

export default MapPage;
