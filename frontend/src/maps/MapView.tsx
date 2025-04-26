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
  readonly = false, 
}: {
  onRouteDataChange: (data: {
    points: Point[];
    segments: RouteSegment[];
  }) => void;
  initialData: { points: Point[]; segments: RouteSegment[] };
  readonly?: boolean;  
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
      hasInteractedRef.current = false;
    }
  }, [points, segments, onRouteDataChange, hasInteractedRef]);

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
        
        {!readonly && (
          <ClickHandler
            onClick={(lat, lng) => {
              void wrappedAddPoint(lat, lng);
            }}
          />
        )}

        <RoutePolyline route={route} />
        <PointMarker points={points.filter((p) => p.type === "main")} />
        {route.length > 0 ? (
          <AutoFocusView points={route} />
        ) : (
          <UserFocusView />
        )}
      </MapContainer>

      {!readonly && (
        <>
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
              void wrappedReorderPoints(from, to);
            }}
            onToggleType={(id) => {
              wrappedTogglePointType(id);
            }}
            onRemove={(id) => {
              void wrappedRemovePoint(id);
            }}
          />
        </>
      )}
    </div>
  );
};


export default MapView;
