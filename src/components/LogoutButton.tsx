import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Button color="secondary" variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
