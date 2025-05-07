import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PolicyIcon from "@mui/icons-material/Policy";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// Define expected token payload
interface TokenPayload {
  sub: string;
}

const DrawerComp = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUsername(decoded.sub);
      } catch (err) {
        console.error("Invalid token:", err);
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenDrawer(false); // Close drawer after navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    navigate("/login");
    setOpenDrawer(false);
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "News", icon: <ArticleIcon />, path: "/news" },
    { text: "Policy", icon: <PolicyIcon />, path: "/policy" },
    { text: "Upload Files", icon: <UploadFileIcon />, path: "/uploadfiles" },
    { text: "Start a New Case", icon: <AddCircleOutlineIcon />, path: "/startanewcase" },
  ];

  return (
    <>
      <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 250 }}>
          <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
            {username ? (
              <>
                <Avatar sx={{ mr: 1 }}>{username.charAt(0).toUpperCase()}</Avatar>
                <ListItemText primary={username} />
              </>
            ) : (
              <ListItemText primary="Welcome Guest" />
            )}
          </Box>

          <Divider />

          <List>
            {menuItems.map((item, index) => (
              <ListItemButton key={index} onClick={() => handleNavigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          <List>
            {username ? (
              <>
                <ListItemButton onClick={() => handleNavigate("/settings")}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton onClick={() => handleNavigate("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <IconButton
        sx={{ color: "white", marginLeft: "auto" }}
        onClick={() => setOpenDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DrawerComp;
