import React, { useState } from "react";
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
  Modal,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DrawerComp from "./DrawerComp";
import { useNavigate } from "react-router-dom";
import SearchBarComponent from "./SearchBarComponent";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";
import UploadFiles from "./UploadFiles";

const Pages = [
  "Home",
  "News",
  "Policy",
  "Upload Files",
  "Start a New Case",
  "Settings",
];

const HeaderComponent = () => {
  const [value, setValue] = useState(0); // Set default tab value to 0
  const [openLoginModal, setOpenLoginModal] = useState(false); // state to open login Modal
  const [openSignupModal, setOpenSignupModal] = useState(false);
  
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // Function to handle Tab changes
  const handleTabChange = (newValue: number) => {
    setValue(newValue);
    //  if the Home tab is selected
    if (newValue === 0) {
      navigate("/"); // Navigate to the home page (root path)
    } else if (newValue === 3){

    
    } else {
      navigate(`/${Pages[newValue].toLowerCase().replace(/\s+/g, "")}`);
    }
  };

  const handleLoginInputChange = () => {
    console.log("Input Changed:");
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
                onChange={(e, newValue) => handleTabChange(newValue)} // Pass only newValue
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
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenLoginModal(true)}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenSignupModal(true)}
                >
                  SignUp
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box>
      {value === 3 && <UploadFiles />}
      </Box>

      <Modal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 2 }}>
          <LoginComponent handleChange={handleLoginInputChange} />
        </Box>
      </Modal>

      <Modal
        open={openSignupModal}
        onClose={() => setOpenSignupModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ backgroundColor: "white", padding: 1, borderRadius: 1 }}>
          <SignupComponent />
        </Box>
      </Modal>

      
    </>
  );
};

export default HeaderComponent;
