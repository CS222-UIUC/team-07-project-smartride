import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import RoutePolyline from "./widgets/visuals/RoutePolyline";
import PointMarker from "./widgets/visuals/PointMarker";
import AutoFocusView from "./widgets/visuals/AutoFocusView";
import UserFocusView from "./widgets/visuals/UserFocusView";
import ClickHandler from "./widgets/interaction/ClickHandler";
import PanelButton from "./widgets/interaction/PanelButton";
import MapPanel from "./MapPanel";
import NavigationArrow from "./widgets/visuals/NavigationArrow";

import type { PlanMapBindings } from "@/features/map/plan/props";
import type { NavMapBindings } from "@/features/map/nav/props";
import type { UnknownBindings } from "@/features/map/unknown/props";

type MapBindings = PlanMapBindings | NavMapBindings | UnknownBindings;

const MapView = (props: MapBindings) => {
  if (props.bindClass === "plan") {
    const {
      routeData,
      userFocus,
      onClickAddPoint,
      onReorderPoint,
      onTogglePointType,
      onRemovePoint,
      isPanelOpen,
      onOpenPanel,
      onClosePanel,
    } = props;

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
              onClickAddPoint(lat, lng);
            }}
          />
          <RoutePolyline processedRoute={routeData.segments} />
          <PointMarker
            points={routeData.points.filter((p) => p.type === "main")}
          />
          {userFocus ? (
            <AutoFocusView points={routeData.segments} />
          ) : (
            <UserFocusView />
          )}
        </MapContainer>

        <PanelButton onClick={onOpenPanel} />
        <MapPanel
          isOpen={isPanelOpen}
          onClose={onClosePanel}
          points={routeData.points}
          onReorder={onReorderPoint}
          onToggleType={onTogglePointType}
          onRemove={onRemovePoint}
        />
      </div>
    );
  } else if (props.bindClass === "nav") {
    const { userPosition, traveledPolyline, remainingPolyline, userFocus } =
      props;

    return (
      <div className="relative w-full h-full">
        <MapContainer
          center={[0, 0]}
          zoom={1}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RoutePolyline processedRoute={traveledPolyline} color="blue" />
          <RoutePolyline processedRoute={remainingPolyline} color="red" />
          <NavigationArrow position={userPosition} />
          {userFocus ? (
            <AutoFocusView
              points={[...traveledPolyline, ...remainingPolyline]}
            />
          ) : (
            <UserFocusView />
          )}
        </MapContainer>
      </div>
    );
  } else {
    // This should be unreachable if types are respected
    throw new Error("Invalid bindClass provided to MapView.");
  }
};

export default MapView;
