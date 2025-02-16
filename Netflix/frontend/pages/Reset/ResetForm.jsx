import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const ResetForm = () => {
 
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

          <form >
          <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                id="password"
                required
              />
            </div>

            <button type="submit">Send Reset Link</button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
