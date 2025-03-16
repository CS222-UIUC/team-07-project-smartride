import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { loginUser } from "./../authentication/login"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with:", email, password);
    try {
      const data = await loginUser(email, password);
      console.log("Login successful", data);
      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg((error as Error).message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
        <button onClick={() => navigate("/")} style={{ fontSize: "16px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer"}}>
          Back
        </button>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button type="submit">Login</button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
};

export default LoginPage;
