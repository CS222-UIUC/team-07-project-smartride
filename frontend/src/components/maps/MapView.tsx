import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

import RoutePolyline from "./RoutePolyline";
import WaypointMarkers from "./WaypointMarkers";
import AutoFocusView from "./AutoFocusView";
import MapClickHandler from "./MapClickHandler";
import SetViewToUserOnce from "./SetViewToUserOnce";
import PanelButton from "./PanelButton";
import MapPanel from "./MapPanel";
import { useManagePoints } from "./managePoints";

const MapView = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const {
    points,
    route,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
  } = useManagePoints();

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[0, 0]}
        zoom={1}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapClickHandler
          onClick={(lat, lng) => {
            addPoint(lat, lng);
          }}
        />

        <RoutePolyline route={route} />
        <WaypointMarkers points={points.filter((p) => p.type === "main")} />
        {route.length > 0 && <AutoFocusView points={route} />}
        <SetViewToUserOnce />
      </MapContainer>

      <PanelButton
        onClick={() => {
          setPanelOpen(true);
        }}
      />

      <MapPanel
        isOpen={panelOpen}
        onClose={() => {
          setPanelOpen(false);
        }}
        points={points}
        onReorder={reorderPoints}
        onToggleType={togglePointType}
        onRemove={removePoint}
      />
    </div>
  );
};

export default MapView;
