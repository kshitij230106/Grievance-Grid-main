import React, { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // ← save user
        alert("Login Successful");
        onLogin(data.user.role); // ← pass role to App.js
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check credentials.");
    }
  };

  return (
    <>
      <div className="auth-header">
        <div className="auth-logo">G</div>
        <h1>Welcome back</h1>
        <p className="page-tagline">Sign in to your Grievance Grid account</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-block btn-lg">
          Login
        </button>
      </form>
    </>
  );
}

export default Login;