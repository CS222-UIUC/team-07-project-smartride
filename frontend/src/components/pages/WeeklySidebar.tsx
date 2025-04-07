import React from "react";
import { useNavigate } from "react-router-dom";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WeeklySidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (day: string) => {
    // Navigate to the route for the selected day (lowercase for URL)
    void navigate(`/route/${day.toLowerCase()}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {weekdays.map((day) => (
        // eslint-disable-next-line react-dom/no-missing-button-type
        <button
          key={day}
          onClick={() => { handleClick(day); }}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default WeeklySidebar;

