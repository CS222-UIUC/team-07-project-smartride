import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo } from "react";

import RoutePolyline from "./widgets/RoutePolyline";
import PointMarker from "./widgets/PointMarker";
import AutoFocusView from "./widgets/AutoFocusView";
import ClickHandler from "./widgets/ClickHandler";
import UserFocusView from "./widgets/UserFocusView";
import PanelButton from "./widgets/PanelButton";
import MapPanel from "./MapPanel";
import { useRouteOperations } from "./manage/operations";

const MapView = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const {
    points,
    segments,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
  } = useRouteOperations();

  const route = useMemo(() => segments.flatMap((s) => s.path), [segments]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[0, 0]}
        zoom={1}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler
          onClick={(lat, lng) => {
            void addPoint(lat, lng);
          }}
        />

        <RoutePolyline route={route} />
        <PointMarker points={points.filter((p) => p.type === "main")} />
        {route.length > 0 && <AutoFocusView points={route} />}
        {route.length == 0 && <UserFocusView />}
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
        onReorder={(from, to) => {
          void reorderPoints(from, to);
        }}
        onToggleType={(id) => {
          togglePointType(id);
        }}
        onRemove={(id) => {
          void removePoint(id);
        }}
      />
    </div>
  );
};

export default MapView;
