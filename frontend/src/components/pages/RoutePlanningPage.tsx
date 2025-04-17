// import MapView from "@/maps/MapView.tsx";

// import { CSSProperties, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useIsPhone } from "@/components/context/PhoneContext.tsx";
// import { createOrUpdateRoute } from "@/api/map/route_store.ts";
// import { Button } from "@/components/ui/button.tsx";
// import type { Point, RouteSegment } from "@/maps/manage/structure.ts";

// const MapWrapper = () => {
//   const IsPhone = useIsPhone();
//   const style: CSSProperties = IsPhone
//     ? {
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }
//     : {
//         width: "60%",
//         height: "90%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       };

//   return (
//     <div style={style}>
//       <MapView />
//     </div>
//   );
// };

// const RoutePlanningPage = () => {
//   /* id and route_name may be undefined, if the user is creating a new route */
//   const [searchParams] = useSearchParams();
//   const initialRouteId = parseInt(searchParams.get("id") || "-1");
//   const [routeId, setRouteId] = useState<number>(initialRouteId);
//   const initialRouteName = searchParams.get("route_name") || "New Route";
//   const [routeName, setRouteName] = useState<string>(initialRouteName);

//   const [routeData, setRouteData] = useState<{
//     points: Point[];
//     segments: RouteSegment[];
//   }>({ points: [], segments: [] });

//   const handleSave = async () => {
//     const result = await createOrUpdateRoute(routeId, routeName, routeData);
//     if (result && routeId === -1) {
//       // If the routeId is -1, it means we are creating a new route
//       setRouteId(result.id);
//       alert(`Route created with ID: ${String(result.id)}`);
//     } else if (result) {
//       // If the routeId is not -1, it means we are updating an existing route
//       alert(`Route updated with ID: ${String(result.id)}`);
//     } else {
//       alert("Failed to save route");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//         width: "100%",
//         alignItems: "center",
//       }}
//     >
//       {/* For this week, we do not load the route, but show the name in the name field */}
//       {/* Allow user to change the name of the route */}
//       <input
//         type="text"
//         value={routeName}
//         onChange={(e) => {
//           setRouteName(e.target.value);
//         }}
//         placeholder="Route Name"
//         style={{
//           width: "80%",
//           padding: "10px",
//           marginBottom: "20px",
//           borderRadius: "5px",
//           border: "1px solid #ccc",
//         }}
//       />
//       <MapWrapper />
//       <div>
//         <Button
//           onClick={() => {
//             void handleSave();
//           }}
//           className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-md shadow-md"
//         >
//           Save/Update Route
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RoutePlanningPage;


import MapView from "@/maps/MapView.tsx";

import { CSSProperties, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsPhone } from "@/components/context/PhoneContext.tsx";
import { createOrUpdateRoute } from "@/api/map/route_store.ts";
import { Button } from "@/components/ui/button.tsx";
import type { Point, RouteSegment } from "@/maps/manage/structure.ts";
import { useEffect } from "react";

const MapWrapper = ({
  onRouteDataChange,
  initialData,
}: {
  onRouteDataChange: (data: { points: Point[]; segments: RouteSegment[] }) => void;
  initialData: { points: Point[]; segments: RouteSegment[] };
}) => {
  const IsPhone = useIsPhone();
  const style: CSSProperties = IsPhone
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
      <MapView onRouteDataChange={onRouteDataChange} initialData={initialData} />
    </div>
  );
};

const RoutePlanningPage = () => {
  const [searchParams] = useSearchParams();
  const initialRouteId = parseInt(searchParams.get("id") || "-1");
  const [routeId, setRouteId] = useState<number>(initialRouteId);
  const initialRouteName = searchParams.get("route_name") || "New Route";
  const [routeName, setRouteName] = useState<string>(initialRouteName);

  const [routeData, setRouteData] = useState<{
    points: Point[];
    segments: RouteSegment[];
  }>({ points: [], segments: [] });

  const [hasLoadedData, setHasLoadedData] = useState(false);

  const handleSave = async () => {
    const result = await createOrUpdateRoute(routeId, routeName, routeData);
    if (result && routeId === -1) {
      setRouteId(result.id);
      alert(`Route created with ID: ${String(result.id)}`);
    } else if (result) {
      alert(`Route updated with ID: ${String(result.id)}`);
    } else {
      alert("Failed to save route");
    }
  };
  useEffect(() => {
    async function fetchRouteData() {
      if (routeId !== -1 && !hasLoadedData) {
        const res = await fetch("/api/get_routes", {
          credentials: "include",
        });
        const result = await res.json();
        if (result.success) {
          const found = result.data.find((r: any) => r.id === routeId);
          if (found?.route_data) {
            console.log("Loaded route_data from backend:", found.route_data);
            setRouteData(found.route_data);
          }
          setHasLoadedData(true); // ✅ 设置为 true，阻止后续重复 fetch
        }
      }
    }
  
    void fetchRouteData();
  }, [routeId, hasLoadedData]);
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={routeName}
        onChange={(e) => {
          setRouteName(e.target.value);
        }}
        placeholder="Route Name"
        style={{
          width: "80%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      {routeId === -1 || routeData.points.length > 0 ? (
  <MapWrapper
    initialData={routeData}
    onRouteDataChange={(data) => {
      setRouteData(data);
    }}
  />
) : (
  <div>Loading route data...</div> // or a spinner
)}
      <div>
        <Button
          onClick={() => {
            void handleSave();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Save/Update Route
        </Button>
      </div>
    </div>
  );
};

export default RoutePlanningPage;
