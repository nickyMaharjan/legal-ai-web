import {
  Avatar,
  Button,
  FormHelperText,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as ApiPath from "../utils/api.url";
import { useNavigate } from "react-router-dom";

const SignupComponent = () => {
  const navigate = useNavigate();
  const paperStyle = {
    padding: "20px 16px",
    width: "100%",
    maxwidth: "400",
    margin: "20px auto",
    height: "auto",
    minHeight: "auto",
    overFlowY: "auto",
  };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#B8860B" };
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
    termsAndCondition: Yup.string().oneOf(
      ["true"],
      "Accept terms & conditions"
    ),
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
    <Grid2
      container
      justifyContent="center"
      sx={{ width: "100%", maxWidth: 400 }}
    >
      <Paper
        elevation={20}
        sx={{
          marginTop: 3,
          padding: 2,
          width: "100%",
          maxWidth: "400px",
          "@media (max-width:600px)": {
            width: "90%",
          },
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
                sx={{ mb: 0 }}
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
                sx={{ mb: 0 }}
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
                sx={{ mb: 0 }}
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
                sx={{ mb: 0 }}
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
                sx={{ mb: 0 }}
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
                sx={{ mb: 0 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton onClick={handleClickShowPassword} edge="end">
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
                sx={{ mb: 0 }}
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
                  bgcolor: "#B8860B",
                  "@media (max-width:600px)": {
                    fontSize: "0.9rem",
                  },
                }}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid2>
  );
};

export default SignupComponent;
