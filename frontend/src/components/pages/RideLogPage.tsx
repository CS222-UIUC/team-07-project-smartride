import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RideData {
  distance: number;
  duration: number;
  calories: number;
  date: string;
}

const RideLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastRide, setLastRide] = useState<RideData | null>(null);

  // Load previous ride from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lastRide");
    if (stored) {
      setLastRide(JSON.parse(stored));
    }
  }, []);

  const calculateCalories = (distance: number, duration: number): number => {
    const durationInHours = duration / 60;
  
    if (durationInHours === 0) return 0;
  
    const speed = distance / durationInHours; // km/h
  
    // Mock MET based on speed
    let met = 4; // default low effort
    if (speed >= 16 && speed < 20) met = 8;
    else if (speed >= 20 && speed < 25) met = 10;
    else if (speed >= 25) met = 12;
  
    const weight = 70; // fixed for now
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
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "16px", fontWeight: "bold"}}>
        Log a Ride
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          Distance (km):
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            required
            min={0}
            step={0.1}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
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
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
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
        <div style={{ marginTop: "24px", padding: "16px", border: "1px solid #eee", borderRadius: "8px", background: "#f9f9f9" }}>
          <h3>Last Ride:</h3>
          <p><strong>Distance:</strong> {lastRide.distance} km</p>
          <p><strong>Duration:</strong> {lastRide.duration} min</p>
          <p><strong>Calories:</strong> {lastRide.calories} kcal</p>
          <p><strong>Date:</strong> {lastRide.date}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/home")}
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

export default RideLogPage;
