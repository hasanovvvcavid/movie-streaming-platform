import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authUser";
import toast from "react-hot-toast";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    login({ email, password });
    setTimeout(() => {
      navigate("/");
    }, 1000);
    toast.success("Login successful");

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
          <h1>Sign In</h1>

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
              {isLoggingIn ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="login-link">
            Don't have any account ? <Link to={"/register"}>Sign Up</Link>
          </div>
          <div className="login-link">
            Forgot your password ? <Link to={"/reset-password"}>Forgot Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
