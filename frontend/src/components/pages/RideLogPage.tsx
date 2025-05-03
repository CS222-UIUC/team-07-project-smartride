// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// interface RideData {
//   distance: number;
//   duration: number;
//   calories: number;
//   date: string;
// }

// const RideLogPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const routeId = parseInt(searchParams.get("routeId") ?? "-1");

//   const [distance, setDistance] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [autoFilled, setAutoFilled] = useState(false);
//   const [lastRide, setLastRide] = useState<RideData | null>(null);

//   // Detect routeId and set distance = 10 if needed
//   useEffect(() => {
//     if (routeId !== -1) {
//       setDistance(10);
//       setAutoFilled(true);
//     }
//   }, [routeId]);

//   // Load previous ride from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("lastRide");
//     if (stored) {
//       setLastRide(JSON.parse(stored) as RideData);
//     }
//   }, []);

//   const calculateCalories = (distance: number, duration: number): number => {
//     const durationInHours = duration / 60;
//     if (durationInHours === 0) return 0;

//     const speed = distance / durationInHours;
//     let met = 4;
//     if (speed >= 16 && speed < 20) met = 8;
//     else if (speed >= 20 && speed < 25) met = 10;
//     else if (speed >= 25) met = 12;

//     const weight = 70;
//     return Math.round(met * weight * durationInHours);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const calories = calculateCalories(distance, duration);
//     const ride: RideData = {
//       distance,
//       duration,
//       calories,
//       date: new Date().toLocaleString(),
//     };
//     localStorage.setItem("lastRide", JSON.stringify(ride));
//     setLastRide(ride);

//     navigate("/ride-log", { replace: true });
//   };

//   return (
//     <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
//       <h2
//         style={{
//           textAlign: "center",
//           fontSize: "24px",
//           marginBottom: "16px",
//           fontWeight: "bold",
//         }}
//       >
//         Log a Ride
//       </h2>

//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", gap: "12px" }}
//       >
//         <label>
//           Distance (km):
//           <input
//             type="number"
//             value={distance}
//             onChange={(e) => setDistance(Number(e.target.value))}
//             disabled={autoFilled} // 👈 禁止修改
//             required
//             min={0}
//             step={0.1}
//             style={{
//               padding: "8px",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//               width: "100%",
//               backgroundColor: autoFilled ? "#f0f0f0" : "white",
//             }}
//           />
//         </label>

//         <label>
//           Duration (min):
//           <input
//             type="number"
//             value={duration}
//             onChange={(e) => setDuration(Number(e.target.value))}
//             required
//             min={0}
//             step={1}
//             style={{
//               padding: "8px",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//               width: "100%",
//             }}
//           />
//         </label>

//         <button
//           type="submit"
//           style={{
//             padding: "10px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "6px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Save Ride
//         </button>
//       </form>

//       {lastRide && (
//         <div
//           style={{
//             marginTop: "24px",
//             padding: "16px",
//             border: "1px solid #eee",
//             borderRadius: "8px",
//             background: "#f9f9f9",
//           }}
//         >
//           <h3>Last Ride:</h3>
//           <p>
//             <strong>Distance:</strong> {lastRide.distance} km
//           </p>
//           <p>
//             <strong>Duration:</strong> {lastRide.duration} min
//           </p>
//           <p>
//             <strong>Calories:</strong> {lastRide.calories} kcal
//           </p>
//           <p>
//             <strong>Date:</strong> {lastRide.date}
//           </p>
//         </div>
//       )}

//       <button
//         type="button"
//         onClick={() => void navigate("/home")}
//         style={{
//           marginTop: "20px",
//           padding: "10px",
//           backgroundColor: "#eee",
//           borderRadius: "6px",
//           border: "none",
//           fontWeight: 600,
//           cursor: "pointer",
//         }}
//       >
//         Back to Home
//       </button>
//     </div>
//   );
// };

// export default RideLogPage;



import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRouteById } from "@/api/map/manage_routes"; // ✅ 确保你有这个 API

interface RideData {
  distance: number;
  duration: number;
  calories: number;
  date: string;
}

const RideLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeId = parseInt(searchParams.get("routeId") ?? "-1");

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoFilled, setAutoFilled] = useState(false);
  const [lastRide, setLastRide] = useState<RideData | null>(null);

  useEffect(() => {
    if (routeId !== -1) {
      const fetchAndComputeDistance = async () => {
        try {
          const res = await getRouteById(routeId);
          if (res?.route_data) {
            const routeData = typeof res.route_data === "string"
              ? JSON.parse(res.route_data)
              : res.route_data;

            const segments = routeData.segments ?? [];

            let totalDistance = 0;
            for (const segment of segments) {
              totalDistance += computeSegmentDistance(segment.path);
            }

            setDistance(Number(totalDistance.toFixed(2)));
            setAutoFilled(true);
          }
        } catch (err) {
          console.error("Failed to auto-load route data", err);
        }
      };
      void fetchAndComputeDistance();
    }
  }, [routeId]);

  useEffect(() => {
    const stored = localStorage.getItem("lastRide");
    if (stored) {
      setLastRide(JSON.parse(stored) as RideData);
    }
  }, []);

  const calculateCalories = (distance: number, duration: number): number => {
    const durationInHours = duration / 60;
    if (durationInHours === 0) return 0;
    const speed = distance / durationInHours;
    let met = 4;
    if (speed >= 16 && speed < 20) met = 8;
    else if (speed >= 20 && speed < 25) met = 10;
    else if (speed >= 25) met = 12;

    const weight = 70;
    return Math.round(met * weight * durationInHours);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calories = calculateCalories(distance, duration);
    const ride: RideData = {
      distance,
      duration,
      calories,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem("lastRide", JSON.stringify(ride));
    setLastRide(ride);

    navigate("/ride-log", { replace: true });
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "16px",
          fontWeight: "bold",
        }}
      >
        Log a Ride
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <label>
          Distance (km):
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            disabled={autoFilled}
            required
            min={0}
            step={0.1}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
              backgroundColor: autoFilled ? "#f0f0f0" : "white",
            }}
          />
        </label>

        <label>
          Duration (min):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
            min={0}
            step={1}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Ride
        </button>
      </form>

      {lastRide && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            border: "1px solid #eee",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <h3>Last Ride:</h3>
          <p><strong>Distance:</strong> {lastRide.distance} km</p>
          <p><strong>Duration:</strong> {lastRide.duration} min</p>
          <p><strong>Calories:</strong> {lastRide.calories} kcal</p>
          <p><strong>Date:</strong> {lastRide.date}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => void navigate("/home")}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#eee",
          borderRadius: "6px",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
};


function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; 
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function computeSegmentDistance(path: { lat: number; lng: number }[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += haversineDistance(
      path[i - 1].lat,
      path[i - 1].lng,
      path[i].lat,
      path[i].lng
    );
  }
  return total;
}

export default RideLogPage;
