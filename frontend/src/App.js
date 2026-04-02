import React, { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import CreateGrievance from "./components/CreateGrievance";
import MyGrievance from "./components/MyGrievance";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(savedUser?.role || "user");
  const [showRegister, setShowRegister] = useState(true);
  const [page, setPage] = useState("create");

  const handleLogin = (userRole) => {
    setLoggedIn(true);
    setRole(userRole); // ← set role from Login.js
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setRole("user");
  };

  // ── Not logged in ────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          {showRegister ? (
            <Register />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <div className="auth-footer">
            <button
              type="button"
              className="btn-toggle-auth"
              onClick={() => setShowRegister(!showRegister)}
            >
              {showRegister
                ? "Already have an account? Go to Login"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin ────────────────────────────────────────────────────
  if (role === "admin") {
    return <AdminDashboard />;
  }

  // ── Regular user ─────────────────────────────────────────────
  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-brand-icon">G</span>
          <span className="navbar-brand-name">
            Grievance <span>Grid</span>
          </span>
        </div>
        <ul className="navbar-links">
          <li>
            <button
              type="button"
              className={page === "create" ? "active" : ""}
              onClick={() => setPage("create")}
            >
              Create Grievance
            </button>
          </li>
          <li>
            <button
              type="button"
              className={page === "my" ? "active" : ""}
              onClick={() => setPage("my")}
            >
              My Grievances
            </button>
          </li>
          <li>
            <button type="button" className="btn-logout" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <main className="page-content">
        {page === "create" && <CreateGrievance />}
        {page === "my" && <MyGrievance />}
      </main>
    </div>
  );
}

export default App;