import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserProfile } from "@/api/profile/basic_info";
import { BasicInfoType, EMPTY_BASIC_INFO } from "@/types/UserProfile";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [initialProfile, setInitialProfile] =
    useState<BasicInfoType>(EMPTY_BASIC_INFO);
  const [profile, setProfile] = useState<BasicInfoType>(EMPTY_BASIC_INFO);
  const [avatar, setAvatar] = useState<string | null>(null);

  const isSaveEnabled =
    !saved && JSON.stringify(profile) !== JSON.stringify(initialProfile);

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

  const handleSave = async () => {
    await updateUserProfile(profile)
      .then(() => {
        setInitialProfile(profile);
        setSaved(true);
      })
      .catch((err: unknown) => {
        toast.error("Failed to save");
        console.error(err);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile()
        .then((data) => {
          setInitialProfile(data);
          setProfile(data);
        })
        .catch((err: unknown) => {
          console.error("Failed to load profile:", err);
        });
    };
    void fetchData();
  }, []);

  const totalDistance = "0 km";
  const totalRideTime = "0 min";
  const totalCalories = "0 kcal";

  return (
    <div className="p-6 h-full flex flex-col justify-between font-sans">
      <div>
        <h1 className="text-center text-2xl font-bold mb-4">User Profile</h1>

        <div className="flex flex-col items-center mb-6">
          <div
            className="w-[100px] h-[100px] rounded-full bg-gray-300 mb-2"
            style={{
              backgroundImage: avatar ? `url(${avatar})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <label
            htmlFor="avatar-upload"
            className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium cursor-pointer shadow-sm"
          >
            Upload / Change Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { label: "Total Riding Distance", value: totalDistance },
            { label: "Total Time", value: totalRideTime },
            { label: "Calories", value: totalCalories },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 min-w-[100px] max-w-[140px] bg-gray-100 rounded-xl p-3 shadow text-center"
            >
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">
            Name:
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full p-2 border border-gray-200 rounded-md mt-1 bg-gray-100 text-sm"
            />
          </label>

          {[
            {
              label: "Nickname",
              key: "nickname",
              type: "text",
            },
            {
              label: "Height (cm)",
              key: "height",
              type: "number",
            },
            {
              label: "Weight (kg)",
              key: "weight",
              type: "number",
            },
            {
              label: "Age",
              key: "age",
              type: "number",
            },
          ].map((field) => (
            <label key={field.label} className="text-sm font-medium">
              {field.label}:
              <input
                type={field.type}
                value={profile[field.key as keyof BasicInfoType] ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfile((prev) => ({
                    ...prev,
                    [field.key]:
                      val === ""
                        ? undefined
                        : field.type === "number"
                          ? Number(val)
                          : val,
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              />
            </label>
          ))}

          <label className="text-sm font-medium">
            Email:
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-2 border border-gray-200 rounded-md mt-1 bg-gray-100 text-sm"
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        disabled={!isSaveEnabled}
        onClick={() => void handleSave()}
        className={`mt-5 p-2 rounded-md font-semibold border-none ${isSaveEnabled ? "bg-green-500 text-white cursor-pointer" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
      >
        Update and Save
      </button>

      <button
        type="button"
        onClick={() => void navigate("/home")}
        className="mt-5 p-2 bg-gray-200 rounded-md border-none font-semibold cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ProfilePage;
