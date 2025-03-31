import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  Button,
  Avatar,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid2,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import LogoutButton from "./LogoutButton";
import LockOutLinedIcon from "@mui/icons-material/LockOutlined";
import SignupModalComponent from "./SignupModalComponent";
import axios from "axios";
import * as ApiPath from "../utils/api.url";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginComponent: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false); //toggle between login and signup

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const isLoggedIn = localStorage.getItem("token");

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (location.pathname === "/login") {
      setOpen(true);
    }
  }, [location]);

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // Go back to the previous page
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setLoginStatus("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request:", JSON.stringify(credentials));
      const response = await axios.post(
        ApiPath.LOGIN_URL,
        {
          username: credentials.username,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",

            Accept: "application/json",
          },
        }
      );

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setLoginStatus("Login successful");
        navigate("/search");
      } else {
        setLoginStatus("Invalid credentials");
      }
    } catch (error) {
      setLoginStatus("Error occured. Please try again");
    } finally {
      setLoading(false);
    }
  };

  // toogle between login and signup
  const toggleSignup = () => {
    setShowSignup(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      handleLogin();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 3,
          borderRadius: "8px",
          boxShadow: 24,
          minWidth: "300px",
        }}
      >
        {/* <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
          Close
        </Button> */}
        <Container maxWidth="xs">
          {showSignup ? (
            <SignupModalComponent />
          ) : (
            <Paper
              elevation={20}
              sx={{
                marginTop: 3,
                padding: 2,
              }}
            >
              <Avatar
                sx={{
                  mx: "auto",
                  bgcolor: "#003366",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                <LockOutLinedIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h6"
                fontWeight="bold"
                color="#003366"
                textAlign="center"
                sx={{ mb: 3 }}
              >
                Legal Portal Login
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  label="Username"
                  placeholder="Enter username"
                  fullWidth
                  required
                  autoFocus
                  name="username"
                  value={credentials.username}
                  onChange={handleChangeInput}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Password"
                  placeholder="Enter your password"
                  fullWidth
                  required
                  autoFocus
                  name="password"
                  value={credentials.password}
                  onChange={handleChangeInput}
                  type={showPassword ? "text" : "password"}
                  sx={{ mb: 1 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      ),
                    },
                  }}
                />

                <Grid2 container justifyContent="flex-end" sx={{ mt: "4px" }}>
                  <RouterLink
                    to="/forgot"
                    style={{
                      textDecoration: "none",
                      fontSize: "0.75rem",
                      fontFamily: "Lato",
                      fontWeight: 400,
                      lineHeight: 1.66,
                    }}
                  >
                    Forgot password?
                  </RouterLink>
                </Grid2>

                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Remember me"
                    sx={{ alignSelf: "start" }}
                  />
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, bgcolor: "#003366" }}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {loginStatus && (
                  <Typography
                    variant="body2"
                    color={
                      loginStatus === "Login successfull" ? "green" : "red"
                    }
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    {loginStatus}
                  </Typography>
                )}
              </Box>

              {isLoggedIn && <LogoutButton />}

              <Box
                justifyContent="space-between"
                sx={{
                  mt: 1,
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  fontFamily: "Lato",
                  fontWeight: 400,
                  lineHeight: 1.66,
                }}
              >
                <Box component="span" sx={{ mr: 1 }}>
                  Don't have an account?
                </Box>

                <RouterLink to="/signup" onClick={toggleSignup}>
                  Register here.
                </RouterLink>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </Modal>
  );
};

export default LoginComponent;
