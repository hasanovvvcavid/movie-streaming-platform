import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router";
import { useAuthStore } from "../../store/authUser";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    login({ email, password });
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

          <form onSubmit={handleLogin}>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button disabled={isLoggingIn}>
              {isLoggingIn ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <div className="login-link">
            Don't have any account ? <Link to={"/register"}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
