"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import {
  Modal,
  Box,
  Typography,
  Button,
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  TextField,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material"
import LogoutButton from "./LogoutButton"
import SignupModalComponent from "./SignupModalComponent"
import axios from "axios"
import * as ApiPath from "../utils/api.url"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import BalanceIcon from "@mui/icons-material/Balance"
import SecurityIcon from "@mui/icons-material/Security"
import GavelIcon from "@mui/icons-material/Gavel"

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<string | null>(null)
  const [showSignup, setShowSignup] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const isLoggedIn = localStorage.getItem("token")
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (location.pathname === "/login") {
      setOpen(true)
    }
  }, [location])

  const handleClose = () => {
    setOpen(false)
    navigate(-1)
  }

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setLoginStatus("Please fill in both fields")
      return
    }

    setLoading(true)
    try {
      console.log("Sending request:", JSON.stringify(credentials))
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
        },
      )

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token)
        window.dispatchEvent(new Event("tokenUpdated"))

        setLoginStatus("Login successful")
        navigate("/search")
      } else {
        setLoginStatus("Invalid credentials")
      }
    } catch (error) {
      setLoginStatus("Error occurred. Please try again")
    } finally {
      setLoading(false)
    }
  }

  const toggleSignup = () => {
    setShowSignup(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loading) {
      handleLogin()
    }
  }

 
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 16px",
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Panel - Dark Blue with Dotted Pattern */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            bgcolor: "#1e2c69",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            minHeight: { xs: "200px", md: "auto" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Pre-rendered dot pattern overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.15,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='white'/%3E%3C/svg%3E")`,
              backgroundSize: "20px 20px",
              willChange: "transform",
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                width: 70,
                height: 70,
                mb: 3,
              }}
            >
              <BalanceIcon sx={{ fontSize: 35, color: "#1e2c69" }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Legal AI Portal
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Advanced legal intelligence at your service
            </Typography>

            <Box sx={{ width: "100%", mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2, width: 36, height: 36 }}>
                  <SecurityIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2">Enterprise-grade security and compliance</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2, width: 36, height: 36 }}>
                  <GavelIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2">AI-powered legal research and analysis</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Panel - Login Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            bgcolor: "#ffffff",
            p: { xs: 3, sm: 4 },
          }}
        >
          {showSignup ? (
            <SignupModalComponent />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "400px",
                mx: "auto",
              }}
            >
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography component="h1" variant="h5" fontWeight="bold" color="#1e2c69">
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Sign in to access your legal AI assistant
                </Typography>
              </Box>

              {loginStatus && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: loginStatus === "Login successful" ? "rgba(46, 125, 50, 0.08)" : "rgba(211, 47, 47, 0.08)",
                    borderRadius: 2,
                    border: `1px solid ${
                      loginStatus === "Login successful" ? "rgba(46, 125, 50, 0.3)" : "rgba(211, 47, 47, 0.3)"
                    }`,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={loginStatus === "Login successful" ? "success.main" : "error.main"}
                    align="center"
                  >
                    {loginStatus}
                  </Typography>
                </Paper>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <TextField
                  label="Username *"
                  placeholder="Enter username"
                  fullWidth
                  required
                  autoFocus
                  name="username"
                  value={credentials.username}
                  onChange={handleChangeInput}
                  variant="outlined"
                />

                <TextField
                  label="Password *"
                  placeholder="Enter your password"
                  fullWidth
                  required
                  name="password"
                  value={credentials.password}
                  onChange={handleChangeInput}
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          aria-label={showPassword ? "hide password" : "show password"}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox name="remember" />}
                      label={<Typography variant="body2">Remember me</Typography>}
                    />
                  </FormGroup>

                  <RouterLink
                    to="/forgot"
                    style={{
                      textDecoration: "none",
                      color: "#1e2c69",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Forgot password?
                  </RouterLink>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    bgcolor: "#1e2c69",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#162052",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                </Button>

                {isLoggedIn && <LogoutButton />}

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Don't have an account?
                  </Typography>

                  <RouterLink
                    to="/signup"
                    onClick={toggleSignup}
                    style={{
                      textDecoration: "none",
                      color: "#1e2c69",
                      fontWeight: 600,
                    }}
                  >
                    Register here
                  </RouterLink>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  )
}

export default LoginComponent
