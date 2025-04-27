import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";

import RoutePolyline from "./widgets/RoutePolyline.tsx";
import PointMarker from "./widgets/PointMarker.tsx";
import AutoFocusView from "./widgets/AutoFocusView.tsx";
import ClickHandler from "./widgets/ClickHandler.tsx";
import PanelButton from "./widgets/PanelButton.tsx";
import MapPanel from "./MapPanel.tsx";
import { useRouteOperations } from "./manage/operations.ts";

import { RouteData } from "@/types/MapRoute.ts";

const MapView = ({
  onRouteDataChange,
  initialData,
}: {
  onRouteDataChange: (route: RouteData) => void;
  initialData: RouteData;
}) => {
  const [panelOpen, setPanelOpen] = useState(false);

  // const [route, setRoute] = useState<RouteData>(initialData);

  const {
    route,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
  } = useRouteOperations(initialData);

  const hasInteractedRef = useRef(false);

  useEffect(() => {
    if (hasInteractedRef.current) {
      onRouteDataChange(route);
      hasInteractedRef.current = false;
    }
  }, [onRouteDataChange, route]);

  const wrappedAddPoint = async (lat: number, lng: number) => {
    await addPoint(lat, lng);
    hasInteractedRef.current = true;
  };

  const wrappedRemovePoint = async (id: string) => {
    await removePoint(id);
    hasInteractedRef.current = true;
  };

  const wrappedReorderPoints = async (from: number, to: number) => {
    await reorderPoints(from, to);
    hasInteractedRef.current = true;
  };

  const wrappedTogglePointType = (id: string) => {
    togglePointType(id);
    hasInteractedRef.current = true;
  };

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
        void wrappedAddPoint(lat, lng);
        }}
      />
      <RoutePolyline route={route} />
      <PointMarker points={route.points.filter((p) => p.type === "main")} />
      <AutoFocusView
        points={route.points.map((p) => [p.coordinates.lat, p.coordinates.lng])}
      />
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
      points={route.points}
      onReorder={(from, to) => {
        void wrappedReorderPoints(from, to);
      }}
      onToggleType={(id) => {
        wrappedTogglePointType(id);
      }}
      onRemove={(id) => {
        void wrappedRemovePoint(id);
      }}
      />
    </div>
  );
};

export default MapView;
