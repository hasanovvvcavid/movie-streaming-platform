import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap/Table"; // İsim çakışmasını önledik.
import "./TableBootstrap.css";
import axios from "axios";
import toast from "react-hot-toast";
import FormModal from "../FormModal/FormModal";
import BasicModal from "../FormModal/FormModal";

const MyTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/auth/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAdminToggle = async (userId, currentAdminStatus) => {
    try {
      const updatedUser = await axios.put(
        `/api/v1/auth/users/${userId}/admin`,
        {
          admin: !currentAdminStatus,
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? updatedUser.data : user))
      );
      toast.success("Admin status updated successfully");
    } catch (err) {
      console.error("Failed to update admin status:", err);
      toast.error("Failed to update admin status");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`/api/v1/auth/users/${userId}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user); // Seçilen kullanıcıyı setle
    handleOpen(); // Modalı aç
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="admin-container-table">
      <BootstrapTable striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user?._id}>
              <td className="td-img">
                <img src={`./public/${user?.image}`} alt="" />
              </td>
              <td>{user?.username}</td>
              <td>{user?.email}</td>
              <td>{user?.password.slice(0, 10) + " ......."}</td>
              <td>
                <div className="checkbox-wrapper-5">
                  <div className="check">
                    <div className="check">
                      <input
                        type="checkbox"
                        id={`check-${user._id}`}
                        checked={user.admin}
                        onChange={() => handleAdminToggle(user._id, user.admin)}
                      />
                      <label htmlFor={`check-${user._id}`}></label>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button
                  onClick={() => handleUpdateClick(user)} // Update butonuna tıklayınca modal açılır
                  className="btn btn-warning"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </BootstrapTable>
      {selectedUser && (
        <BasicModal
          open={open} // Modalın durumu
          handleClose={handleClose} // Modal kapama fonksiyonu
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default MyTable;
