import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// TODO (Richard): Connect to backend, call @/api/profile/web/userprofile.ts to fetch user data, write handleUpdate and also when loaded, handleLoad function

interface UserProfileResponse {
  success: boolean;
  data: {
    name: string;
    email: string;
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // Removed unused 'profile' state to resolve errors

  // Form state
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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });
        const result = (await res.json()) as UserProfileResponse;
        if (result.success) {
          setName(result.data.name || "");
          setEmail(result.data.email || "");
          // setNickname(result.data.nickname || "");
          // setHeight(result.data.height?.toString() || "");
          // setWeight(result.data.weight?.toString() || "");
          // setAge(result.data.age?.toString() || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    void fetchProfile();
  }, []);

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
