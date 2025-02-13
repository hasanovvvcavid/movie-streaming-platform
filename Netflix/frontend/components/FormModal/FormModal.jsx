import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatReleaseDateToSec } from "../../src/utils/dateConverterToSec";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

export default function BasicModal({ open, selectedUser, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: selectedUser?.username || "",
    email: selectedUser?.email || "",
    password: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        password: "",
      });
      setFile(null);
    }
  }, [selectedUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        `/api/v1/auth/update/${selectedUser._id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdate(data);
      toast.success("User updated successfully");
      onClose();
    } catch (error) {
      console.error("Updated wrong", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };
  return (
    <div>
      <Modal
        open={open} 
        onClose={onClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update User
          </Typography>
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                placeholder="image"
                // required
                accept="image/*"
                // value={formData.image}
                onChange={handleFileChange}
                name="image"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                name="username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                name="email"
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                id="password"
                placeholder="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                name="password"
              />
            </div>

            <button type="submit" className="btn btn-primary submit m-0-auto">
              Update
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
