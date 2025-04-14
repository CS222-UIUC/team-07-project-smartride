import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import { registerUser } from "@/api/web/register.ts";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register with:", name, email, password);
    try {
      const data = await registerUser(name, email, password);
      console.log("Register successful", data);
      void navigate("/login");
    } catch (error) {
      console.error("Register failed", error);
      setErrorMsg((error as Error).message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <button
          type="button"
          onClick={() => void navigate("/start")}
          style={{
            fontSize: "16px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      <form
        onSubmit={(e) => {
          void handleRegister(e);
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
};

export default RegisterPage;
