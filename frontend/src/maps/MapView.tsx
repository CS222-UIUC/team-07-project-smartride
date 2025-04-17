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
import { useEffect } from "react";

import type { Point, RouteSegment } from "./manage/structure";
import { useRef } from "react";

const MapView = ({
  onRouteDataChange,
  initialData,
}: {
  onRouteDataChange: (data: {
    points: Point[];
    segments: RouteSegment[];
  }) => void;
  initialData: { points: Point[]; segments: RouteSegment[] };
}) => {
  const [panelOpen, setPanelOpen] = useState(false);

  const {
    points,
    segments,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
  } = useRouteOperations(initialData.points, initialData.segments);

  const hasInteractedRef = useRef(false);

  const route = useMemo(() => segments.flatMap((s) => s.path), [segments]);

  useEffect(() => {
    if (hasInteractedRef.current) {
      onRouteDataChange({ points, segments });
    }
  }, [points, segments, onRouteDataChange]);

  const wrappedAddPoint = async (lat: number, lng: number) => {
    hasInteractedRef.current = true;
    await addPoint(lat, lng);
  };

  const wrappedRemovePoint = async (id: string) => {
    hasInteractedRef.current = true;
    await removePoint(id);
  };

  const wrappedReorderPoints = async (from: number, to: number) => {
    hasInteractedRef.current = true;
    await reorderPoints(from, to);
  };

  const wrappedTogglePointType = (id: string) => {
    hasInteractedRef.current = true;
    togglePointType(id);
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
        <PointMarker points={points.filter((p) => p.type === "main")} />
        {route.length > 0 ? (
          <AutoFocusView points={route} />
        ) : (
          <UserFocusView />
        )}
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
        onReorder={(f, t) => {
          void wrappedReorderPoints(f, t);
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
