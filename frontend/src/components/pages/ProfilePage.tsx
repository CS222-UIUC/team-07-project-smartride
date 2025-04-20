import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../api/utils/route_dictionary";

// TODO (Richard) 1: Move all await fetch("xxx") to api folder, do NOT place them here in a page component.
// TODO (Richard) 2: Use responsive design, do NOT use css values like "24px", "14px".

interface UserProfileResponse {
  success: boolean;
  data: {
    name: string;
    email: string;
    nickname?: string;
    height?: number;
    weight?: number;
    age?: number;
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // Removed unused 'profile' state to resolve errors

  // Form state
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  // Static mock value, will be fetched later
  const [email, setEmail] = useState("");
  const totalDistance = "0 km";
  const totalRideTime = "0 min";
  const totalCalories = "0 kcal";

  // Avatar upload
  const [avatar, setAvatar] = useState<string | null>(null);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isSaveEnabled =
    !saved &&
    (nickname.trim() !== "" ||
      height.trim() !== "" ||
      weight.trim() !== "" ||
      age.trim() !== "");

  const handleSave = async () => {
    try {
      const profile = {
        name,
        email,
        nickname,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        age: age ? parseInt(age) : undefined,
      };

      const res = await fetch(API_ROUTES.WEB_PROFILE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      });

      const result = (await res.json()) as UserProfileResponse;
      if (result.success) {
        alert("Saved successfully!");
        setSaved(true);
      } else {
        alert("Failed to save.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save error.");
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(API_ROUTES.WEB_PROFILE, {
          method: "GET",
          credentials: "include",
        });
        const result = (await res.json()) as UserProfileResponse;
        if (result.success) {
          setName(result.data.name || "");
          setEmail(result.data.email || "");
          setNickname(result.data.nickname || "");
          setHeight(result.data.height?.toString() || "");
          setWeight(result.data.weight?.toString() || "");
          setAge(result.data.age?.toString() || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    void fetchProfile();
  }, []);

  useEffect(() => {
    setSaved(false);
  }, [nickname, height, weight, age]);

  return (
    <div
      style={{
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div>
        {/* Header */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          User Profile
        </h1>

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#ddd",
              backgroundImage: avatar ? `url(${avatar})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "8px",
            }}
          />
          <label
            htmlFor="avatar-upload"
            style={{
              backgroundColor: "#eee",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Upload / Change Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Riding Distance", value: totalDistance },
            { label: "Total Time", value: totalRideTime },
            { label: "Calories", value: totalCalories },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: "1 1 100px",
                minWidth: "100px",
                maxWidth: "140px",
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", color: "#888" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label style={{ fontSize: "14px", fontWeight: 500 }}>
            Name:&nbsp;
            <input
              type="text"
              value={name}
              disabled
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "6px",
                marginTop: "4px",
                backgroundColor: "#f3f3f3",
                fontSize: "14px",
              }}
            />
          </label>

          {[
            // { label: "Name", value: name, setValue: setName, type: "text" },
            {
              label: "Nickname",
              value: nickname,
              setValue: setNickname,
              type: "text",
            },
            {
              label: "Height (cm)",
              value: height,
              setValue: setHeight,
              type: "number",
            },
            {
              label: "Weight (kg)",
              value: weight,
              setValue: setWeight,
              type: "number",
            },
            { label: "Age", value: age, setValue: setAge, type: "number" },
          ].map((field) => (
            <label
              key={field.label}
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              {field.label}:&nbsp;
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => {
                  field.setValue(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </label>
          ))}

          <label style={{ fontSize: "14px", fontWeight: 500 }}>
            Email:&nbsp;
            <input
              type="email"
              value={email}
              disabled
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "6px",
                marginTop: "4px",
                backgroundColor: "#f3f3f3",
                fontSize: "14px",
              }}
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        disabled={!isSaveEnabled}
        onClick={() => void handleSave()}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: isSaveEnabled ? "#4caf50" : "#ccc",
          color: isSaveEnabled ? "#fff" : "#666",
          borderRadius: "6px",
          border: "none",
          fontWeight: 600,
          cursor: isSaveEnabled ? "pointer" : "not-allowed",
        }}
      >
        Update and Save
      </button>

      {/* Back Button */}
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

export default ProfilePage;
