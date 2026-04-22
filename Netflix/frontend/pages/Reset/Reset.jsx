import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../components/Navbar/Logo";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("api/v1/auth/reset-password", { email });
      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Password reset email has been sent. Check your inbox.",
        confirmButtonText: "OK",
      }).then(() => navigate("/login"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to send reset email",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="hero-bg">
      <header className="header">
        <Link to={"/"}>
          
          <Logo />
        </Link>
      </header>

      <div className="form-container">
        <div className="form-box">
          <h1>Forgot Password</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit">
              {isLoading ? "Sending..." : "Send Reset Link"}
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

export default Reset;
