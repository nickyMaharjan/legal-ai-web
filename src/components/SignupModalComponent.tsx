"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  Button,
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  TextField,
  Divider,
  InputAdornment,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Formik, Field, ErrorMessage, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as ApiPath from "../utils/api.url";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BalanceIcon from "@mui/icons-material/Balance";

const SignupComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const initialValues = {
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    termsAndCondition: false,
  };

  useEffect(() => {
    if (location.pathname === "/signup") {
      setOpen(true);
    }
  }, [location]);

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // Go back to the previous page
  };

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().min(3, "It's too short").required("Required"),
    lastname: Yup.string().min(3, "It's too short").required("Required"),
    phonenumber: Yup.number()
      .typeError("Enter valid Phone Number")
      .required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    username: Yup.string().required("Required"),
    password: Yup.string()
      .min(8, "Password minimum length should be 8")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required("Required"),
    termsAndCondition: Yup.boolean()
      .oneOf([true], "Accept terms & conditions")
      .required("Required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const response = await axios.post(ApiPath.SIGNUP_URL, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("Signup Successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.log("Signup failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
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
          overflow: "hidden",
          borderRadius: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxHeight: { xs: "90vh", md: "80vh" },
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
            minHeight: { xs: "180px", md: "auto" },
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
              width: "100%",
              zIndex: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                width: 60,
                height: 60,
                mb: 2,
              }}
            >
              <BalanceIcon sx={{ fontSize: 30, color: "#1e2c69" }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Legal AI Portal
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Create your account to get started
            </Typography>
          </Box>
        </Box>

        {/* Right Panel - White Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            bgcolor: "#ffffff",
            p: { xs: 2, sm: 4 },
            overflowY: "auto",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                mx: "auto",
                bgcolor: "#1e2c69",
                width: 40,
                height: 40,
                mb: 1,
              }}
            >
              <BalanceIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="#1e2c69">
              Register Now
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Please fill this form to create an account
            </Typography>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Field
                      as={TextField}
                      name="firstname"
                      label="First Name *"
                      placeholder="Enter your first name"
                      fullWidth
                      variant="outlined"
                      helperText={<ErrorMessage name="firstname" />}
                      FormHelperTextProps={{
                        sx: { color: "error.main" },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Field
                      as={TextField}
                      name="lastname"
                      label="Last Name *"
                      placeholder="Enter your last name"
                      fullWidth
                      variant="outlined"
                      helperText={<ErrorMessage name="lastname" />}
                      FormHelperTextProps={{
                        sx: { color: "error.main" },
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="phonenumber"
                    label="Phone Number *"
                    placeholder="Enter your number"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="phonenumber" />}
                    FormHelperTextProps={{
                      sx: { color: "error.main" },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email *"
                    placeholder="Enter your email"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="email" />}
                    FormHelperTextProps={{
                      sx: { color: "error.main" },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="username"
                    label="Username *"
                    placeholder="Enter your username"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="username" />}
                    FormHelperTextProps={{
                      sx: { color: "error.main" },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="password"
                    label="Password *"
                    placeholder="Enter your password"
                    fullWidth
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    helperText={<ErrorMessage name="password" />}
                    FormHelperTextProps={{
                      sx: { color: "error.main" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            aria-label={
                              showPassword ? "hide password" : "show password"
                            }
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm Password *"
                    placeholder="Confirm your password"
                    fullWidth
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    helperText={<ErrorMessage name="confirmPassword" />}
                    FormHelperTextProps={{
                      sx: { color: "error.main" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            aria-label={
                              showConfirmPassword
                                ? "hide password"
                                : "show password"
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          name="termsAndCondition"
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          I accept the terms and conditions
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <FormHelperText sx={{ color: "error.main", ml: 2 }}>
                    <ErrorMessage name="termsAndCondition" />
                  </FormHelperText>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
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
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Button
                      onClick={() => navigate("/login")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#1e2c69",
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign in
                    </Button>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Modal>
  );
};

export default SignupComponent;
