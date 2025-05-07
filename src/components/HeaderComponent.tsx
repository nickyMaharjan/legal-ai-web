import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DrawerComp from "./DrawerComp";
import { useNavigate } from "react-router-dom";
import SearchBarComponent from "./SearchBarComponent";
import UploadFiles from "./UploadFiles";
import {jwtDecode} from "jwt-decode";


interface TokenPayload {
  sub: string; 
}

const Pages = [
  "Home",
  "News",
  "Policy",
  "Upload Files",
  "Start a New Case",
  // "Settings",
];

const HeaderComponent = () => {
  const [value, setValue] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  
  useEffect(() => {
    const loadUsername = () => {
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
    };
  
   
    loadUsername();
  
    
    const handleTokenChange = () => loadUsername();
    window.addEventListener("tokenUpdated", handleTokenChange);
  
    
    return () => {
      window.removeEventListener("tokenUpdated", handleTokenChange);
    };
  }, []);

  const handleTabChange = (newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate("/");
    }else if (newValue === 1) {
      navigate("/news");
    }else if (newValue === 3) {
      navigate("/upload_document/");// stays on current route for Upload Files
    } else {
      navigate(`/${Pages[newValue].toLowerCase().replace(/\s+/g, "")}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("tokenUpdated"));
    
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#003366", padding: 2 }}>
        <Toolbar>
          <ChatBubbleOutlineIcon sx={{ marginRight: 1 }} />

          {isMatch ? (
            <>
              <Typography variant="h6" sx={{ marginRight: "auto" }}>
                Your AI
              </Typography>

              <Box>
                <SearchBarComponent />
              </Box>
              <DrawerComp />
            </>
          ) : (
            <>
              <Tabs
                textColor="inherit"
                value={value}
                onChange={(_, newValue) => handleTabChange(newValue)}
                indicatorColor="secondary"
              >
                {Pages.map((page, index) => (
                  <Tab key={index} label={page} />
                ))}
              </Tabs>
              <Box>
                <SearchBarComponent />
              </Box>

              <Box sx={{ display: "flex", gap: 1, marginLeft: "auto" }}>
                {username ? (
                  <>
                    <IconButton onClick={handleMenuOpen} sx={{ color: "#fff" }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem disabled>{username}</MenuItem>
                      <MenuItem onClick={() => navigate("/settings")}>
                        Settings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/signup")}
                    >
                      SignUp
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box>{value === 3 && <UploadFiles />}</Box>
    </>
  );
};

export default HeaderComponent;
