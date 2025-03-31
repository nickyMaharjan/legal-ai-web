import React, { useEffect, useState } from "react";
// import { Form, useLocation, useNavigate } from "react-router-dom";
import { Form } from "formik";
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
  Grid2,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as ApiPath from "../utils/api.url";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid'; 


const SignupComponent: React.FC = () => {
    
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const paperStyle = {
    padding: "20px 16px",
    width: "100%",
    maxWidth: "400px",
    margin: "20px auto",
    height: "auto",
    minHeight: "auto",
  };

  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#003366" };
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 3,
          borderRadius: "8px",
          boxShadow: 24,
          minWidth: "300px",
          maxHeight: "80vh", // Set max height to make it scrollable
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <Paper
            elevation={20}
            sx={{
              marginTop: 3,
              padding: 2,
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              overflowY: "auto",
            }}
            style={paperStyle}
          >
            <Grid2 justifyItems="center">
              <Avatar style={avatarStyle}>
                <AddCircleOutlineOutlinedIcon />
              </Avatar>
              <h1 style={headerStyle}>Register Now</h1>
              <Typography variant="caption" gutterBottom>
                Please fill this form to create an account !
              </Typography>
            </Grid2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Field
                    as={TextField}
                    name="firstname"
                    label="First Name"
                    placeholder="Enter your first name"
                    helperText={<ErrorMessage name="firstname" />}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 1 }}
                  />

                  <Field
                    as={TextField}
                    name="lastname"
                    label=" Last Name"
                    placeholder="Enter your last name"
                    helperText={<ErrorMessage name="lastname" />}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 1 }}
                  />

                  <Field
                    as={TextField}
                    name="phonenumber"
                    label="Phone Number"
                    placeholder="Enter your number"
                    helperText={<ErrorMessage name="phonenumber" />}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 1 }}
                  />

                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    helperText={<ErrorMessage name="email" />}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 1 }}
                  />

                  <Field
                    as={TextField}
                    name="username"
                    label="User Name"
                    placeholder="Enter your username"
                    helperText={<ErrorMessage name="username" />}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 1 }}
                  />

                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    helperText={<ErrorMessage name="password" />}
                    fullWidth
                    required
                    autoFocus
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

                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Enter your confirm password"
                    helperText={<ErrorMessage name="confirmPassword" />}
                    fullWidth
                    required
                    autoFocus
                    type={showConfirmPassword ? "text" : "password"}
                    sx={{ mb: 1 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      },
                    }}
                  />

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          name="termsAndCondition"
                          color="primary"
                        />
                      }
                      label="I accept the terms and conditions."
                      sx={{ alignSelf: "start" }}
                    />
                  </FormGroup>
                  <FormHelperText>
                    <ErrorMessage name="termsAndCondition" />
                  </FormHelperText>

                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{
                      height: "30",
                      marginTop: 0,
                      bgcolor: "#003366",
                    }}
                  >
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid2>
      </Box>
    </Modal>
  );
};

export default SignupComponent;
