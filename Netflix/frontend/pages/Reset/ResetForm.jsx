import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

const ResetForm = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`/api/v1/auth/reset-password/${token}`, { password });
      Swal.fire({
        icon: "success",
        title: "Password Updated!",
        text: "Your password has been successfully updated. You can now log in.",
        confirmButtonText: "Go to Login",
      }).then(() => navigate("/login"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
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
          <h1>Creat New Password</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Reset Password"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
