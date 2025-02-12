import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Admin.css";
import Table from "../../components/Table/TableBootstrap";

const Admin = () => {
  return (
    <div className="hero-bg text-white">
      <div className="admin-container">
        <Navbar />

        <div className="user-table">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Admin;
