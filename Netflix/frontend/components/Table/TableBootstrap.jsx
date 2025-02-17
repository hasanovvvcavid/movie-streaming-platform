import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap/Table";
import "./TableBootstrap.css";
import axios from "axios";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import FormModal from "../FormModal/FormModal";
import BasicModal from "../FormModal/FormModal";
import Swal from "sweetalert2";
import { formatReleaseDate } from "../../src/utils/dateConverter";
import { formatReleaseDateToSec } from "../../src/utils/dateConverterToSec";

const MyTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [showAdminOnly, setShowAdminOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const isFiltered =
    showAdminOnly ||
    showVerifiedOnly ||
    showUnverifiedOnly ||
    sortOrder !== "asc" ||
    searchTerm.trim() !== "";

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

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
    const isConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    });

    if (!isConfirmed.isConfirmed) return;
    try {
      await axios.delete(`/api/v1/auth/users/${userId}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      toast.promise(new Promise((resolve) => setTimeout(resolve, 500)), {
        pending: "Deleting user...",
        success: "User deleted successfully! 🎉",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete user";

      toast.promise(new Promise((resolve) => setTimeout(resolve, 500)), {
        pending: "Deleting user...",
        error: errorMessage,
      });
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    handleOpen();
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  const filteredUsers = users.filter((user) => {
    if (showAdminOnly && !user.admin) return false;
    if (showVerifiedOnly && !user.isVerified) return false;
    if (showUnverifiedOnly && user.isVerified) return false;
    if (
      searchTerm &&
      !user.username.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
      return false;
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const usernameA = a?.username || "";
    const usernameB = b?.username || "";

    return sortOrder === "asc"
      ? usernameA.localeCompare(usernameB)
      : usernameB.localeCompare(usernameA);
  });

  const handleResetFilters = () => {
    setShowAdminOnly(false);
    setShowVerifiedOnly(false);
    setShowUnverifiedOnly(false);
    setSortOrder("asc");
    setSearchTerm("");
  };

  return (
    <div>
      <div className="filter-table-user">
        <div className="filtered-user-basic">
          {/* <button onClick={() => setSortOrder("asc")} className="btn btn-primary">
          A-Z
        </button> */}
          <button
            onClick={() => setSortOrder("desc")}
            className="btn btn-primary"
          >
            Z-A
          </button>
          <h4>Admin :   </h4>
          <div className="isadmin">
            <div className="checkbox-wrapper-7">
              <input
                checked={showAdminOnly}
                onChange={() => setShowAdminOnly(!showAdminOnly)}
                className="tgl tgl-ios"
                id="cb2-7"
                type="checkbox"
              />
              <label className="tgl-btn" htmlFor="cb2-7"></label>
            </div>
          </div>
          <h4>Verified User : </h4>
          <div className="isVerified">
            <div className="checkbox-wrapper-7">
              <input
                checked={showVerifiedOnly}
                onChange={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className="tgl tgl-ios"
                id="cb2-8"
                type="checkbox"
              />
              <label className="tgl-btn" htmlFor="cb2-8"></label>
            </div>
          </div>
          <h4>Unverified User : </h4>
          <div className="unVerified">
            <div className="checkbox-wrapper-7">
              <input
                checked={showUnverifiedOnly}
                onChange={() => setShowUnverifiedOnly(!showUnverifiedOnly)}
                className="tgl tgl-ios"
                id="cb2-9"
                type="checkbox"
              />
              <label className="tgl-btn" htmlFor="cb2-9"></label>
            </div>
          </div>
          {isFiltered && (
            <button onClick={handleResetFilters} className="btn btn-danger">
              Cancel
            </button>
          )}
        </div>
        <div className="search-filter-user">
          <div className="search-user">
            <div className="container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search"></div>
            </div>
          </div>
          
        </div>
      </div>
      <div className="admin-container-table">
        <BootstrapTable striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Admin</th>
              <th>Verified</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user?._id}>
                <td className="td-img">
                  <img src={`./public/${user?.image}`} alt="Profile" />
                </td>
                <td>{user?.username}</td>
                <td>{user?.email}</td>
                <td>••••••••</td>
                <td>
                  <div className="checkbox-wrapper-5">
                    <div className="check">
                      <div className="check">
                        <input
                          type="checkbox"
                          id={`check-${user._id}`}
                          checked={user.admin}
                          onChange={() =>
                            handleAdminToggle(user._id, user.admin)
                          }
                        />
                        <label htmlFor={`check-${user._id}`}></label>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.isVerified ? "✔️" : "❌"}</td>

                <td>{formatReleaseDateToSec(user.isCreated)}</td>
                <td>
                  <button
                    onClick={() => handleUpdateClick(user)}
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
            open={open}
            onClose={handleClose}
            selectedUser={selectedUser}
            onUpdate={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default MyTable;
