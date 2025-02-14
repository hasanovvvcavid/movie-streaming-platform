import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";
import { useAuthStore } from "../../store/authUser";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, setUser } = useAuthStore(); 
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to update your profile?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update!",
        cancelButtonText: "No, cancel",
      });

  if (!confirmation.isConfirmed) {
    return; // Kullanıcı iptal ederse işlemi durdur
  }

    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("email", formData.email);

      if (formData.password) {
        formPayload.append("password", formData.password);
      }

      if (file) {
        formPayload.append("image", file);
      }

      const { data } = await axios.put(
        `/api/v1/auth/update/user/${user._id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(data);
      Swal.fire("Success", "Profile update successfully", "success");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error!", error.response?.data?.error || "Update failed", "error");
    }
  };
  return (
    <div className="hero-bg">
      <Navbar />
      <div className="profile-container">
        <div className="profile-image-big">
          <img src={`./public/${user?.image}`} alt="" />
        </div>

        <div className="form-container">
          <div className="form-box">
            <h1>Profile details</h1>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="image">Image</label>
                <input type="file" placeholder="" id="image" accept="image/*"
            onChange={handleFileChange} />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  id="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" placeholder="johndoe" id="username" value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="••••••••" id="password"  value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            } />
              </div>

              <button type="submit">
                {/* {isSigningUp ? "Loading..." : "Sign Up"} */}Update
              </button>
            </form>

            {/* <div className="login-link">
              Already a member? <Link to={"/login"}>Sign in</Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
