import { useNavigate } from "react-router-dom";
import MapView from "../maps/MapView";

import { CSSProperties } from "react";
import { useIsPhone } from "../context/PhoneContext";

const MapWrapper: React.FC<{ IsPhone: boolean }> = ({ IsPhone }) => {
  const style: CSSProperties = IsPhone
    ? { display: "flex", justifyContent: "center", alignItems: "center", position: "relative", width: "100%", height: "100%" }
    : { display: "flex", justifyContent: "center", alignItems: "center", position: "relative", width: "60%", height: "90%" };

  return (
    <div style={style}>
      <MapView />
    </div>
  );
};

const MapPage = () => {
  const IsPhone = useIsPhone();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>
      <div style={{ width: "60%", margin: "1rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "16px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Back
        </button>
      </div>

      <MapWrapper IsPhone={IsPhone} />
    </div>
  );
};

export default MapPage;
