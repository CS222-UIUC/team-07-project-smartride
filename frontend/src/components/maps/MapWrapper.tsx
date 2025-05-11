import { useIsPhone } from "@/components/context/PhoneContext";
import { CSSProperties } from "react";
import MapView from "./MapView";
import type { PlanMapBindings } from "@/features/map/plan/props";
import type { NavMapBindings } from "@/features/map/nav/props";

const MapWrapper = ({
  bindings,
}: {
  bindings: PlanMapBindings | NavMapBindings;
}) => {
  const isPhone = useIsPhone();

  const style: CSSProperties = isPhone
    ? {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    : {
        width: "60%",
        height: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };

  return (
    <div style={style}>
      <MapView {...bindings} />
    </div>
  );
};

export default MapWrapper;
