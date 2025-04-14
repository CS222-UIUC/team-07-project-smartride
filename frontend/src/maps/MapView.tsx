import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo } from "react";

import RoutePolyline from "./widgets/RoutePolyline.tsx";
import PointMarker from "./widgets/PointMarker.tsx";
import AutoFocusView from "./widgets/AutoFocusView.tsx";
import ClickHandler from "./widgets/ClickHandler.tsx";
import UserFocusView from "./widgets/UserFocusView.tsx";
import PanelButton from "./widgets/PanelButton.tsx";
import MapPanel from "./MapPanel.tsx";
import { useRouteOperations } from "./manage/operations.ts";

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
