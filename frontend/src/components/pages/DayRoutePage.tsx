import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DayRoutePage: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>
        Route for {day?.charAt(0).toUpperCase() + day?.slice(1)}
      </h1>
      {/* Add route details for the day here */}
      <p>
        Display the route details for {day} here.
      </p>
      <button
        type="button"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => navigate("/home")}
        style={{ padding: "10px", marginTop: "20px" }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default DayRoutePage;
