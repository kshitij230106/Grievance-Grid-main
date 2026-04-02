import React, { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      alert(data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <>
      <div className="auth-header">
        <div className="auth-logo">G</div>
        <h1>Create account</h1>
        <p className="page-tagline">Join Grievance Grid to submit and track grievances</p>
      </div>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="reg-name">Name</label>
          <input
            id="reg-name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-block btn-lg">
          Register
        </button>
      </form>
    </>
  );
}

export default Register;
