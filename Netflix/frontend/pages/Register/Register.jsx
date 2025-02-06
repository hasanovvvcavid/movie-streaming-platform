import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router";
import { useAuthStore } from "../../store/authUser";

const Register = () => {
  const { searchParams } = new URL(document.location);
  const emailValue = searchParams.get("email");

  const [email, setEmail] = useState(emailValue || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const { signup } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    signup({ email, username, password });

  };

  return (
    <div className="hero-bg">
      <header className="header">
        <Link to={"/"}>
          <img src="/netflix-logo.png" alt="logo" />
        </Link>
      </header>

      <div className="form-container">
        <div className="form-box">
          <h1>Sign Up</h1>

          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button disabled={isSigningUp}>
              {isSigningUp ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <div className="login-link">
            Already a member? <Link to={"/login"}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
