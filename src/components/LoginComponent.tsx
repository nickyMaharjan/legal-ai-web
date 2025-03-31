// import {
//   Avatar,
//   Box,
//   Button,
//   Container,
//   Grid2,
//   IconButton,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import LockOutLinedIcon from "@mui/icons-material/LockOutlined";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormGroup from "@mui/material/FormGroup";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import { useState } from "react";
// import axios from "axios";
// import * as ApiPath from "../utils/api.url";
// import SignupComponent from "./SignupComponent";
// import LogoutButton from "./LogoutButton";

// type LoginComponentProps = {
//   handleChange: (newValue: number) => void;
// };

// const LoginComponent = ({ handleChange }: LoginComponentProps) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [loginStatus, setLoginStatus] = useState<string | null>(null);
//   const [showSignup, setShowSignup] = useState(false); //toggle between login and signup

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCredentials((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const navigate = useNavigate();
//   const handleLogin = async () => {
//     if (!credentials.username || !credentials.password) {
//       setLoginStatus("Please fill in both fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("Sending request:", JSON.stringify(credentials));
//       const response = await axios.post(
//         ApiPath.LOGIN_URL,
//         {
//           username: credentials.username,
//           password: credentials.password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",

//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.access_token) {
//         localStorage.setItem("token", response.data.access_token);
//         setLoginStatus("Login successful");
//         navigate("/search");
//       } else {
//         setLoginStatus("Invalid credentials");
//       }
//     } catch (error) {
//       setLoginStatus("Error occured. Please try again");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!loading) {
//       handleLogin();
//     }
//   };

//   // toogle between login and signup
//   const toggleSignup = () => {
//     setShowSignup(true);
//     handleChange(1);
//   };

//   const isLoggedIn = localStorage.getItem("token");

//   return (
//     <Container maxWidth="xs">
//       {showSignup ? (
//         <SignupComponent />
//       ) : (
//         <Paper
//           elevation={20}
//           sx={{
//             marginTop: 3,
//             padding: 2,
//           }}
//         >
//           <Avatar
//             sx={{
//               mx: "auto",
//               bgcolor: "#B8860B",
//               textAlign: "center",
//               mb: 1,
//             }}
//           >
//             <LockOutLinedIcon />
//           </Avatar>
//           <Typography
//             component="h1"
//             variant="h6"
//             fontWeight="bold"
//             color="textPrimary"
//             textAlign="center"
//             sx={{ mb: 3 }}
//           >
//             Legal Portal Login
//           </Typography>

//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             noValidate
//             sx={{ mt: 1 }}
//           >
//             <TextField
//               label="Username"
//               placeholder="Enter username"
//               fullWidth
//               required
//               autoFocus
//               name="username"
//               value={credentials.username}
//               onChange={handleChangeInput}
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               label="Password"
//               placeholder="Enter your password"
//               fullWidth
//               required
//               autoFocus
//               name="password"
//               value={credentials.password}
//               onChange={handleChangeInput}
//               type={showPassword ? "text" : "password"}
//               sx={{ mb: 1 }}
//               slotProps={{
//                 input: {
//                   endAdornment: (
//                     <IconButton onClick={handleClickShowPassword} edge="end">
//                       {showPassword ? (
//                         <VisibilityOffIcon />
//                       ) : (
//                         <VisibilityIcon />
//                       )}
//                     </IconButton>
//                   ),
//                 },
//               }}
//             />

//             <Grid2 container justifyContent="flex-end" sx={{ mt: "4px" }}>
//               <RouterLink
//                 to="/forgot"
//                 style={{
//                   textDecoration: "none",
//                   fontSize: "0.75rem",
//                   fontFamily: "Lato",
//                   fontWeight: 400,
//                   lineHeight: 1.66,
//                 }}
//               >
//                 Forgot password?
//               </RouterLink>
//             </Grid2>

//             <FormGroup>
//               <FormControlLabel
//                 control={<Checkbox name="checkedB" color="primary" />}
//                 label="Remember me"
//                 sx={{ alignSelf: "start" }}
//               />
//             </FormGroup>
//             <Button
//               type="submit"
//               color="primary"
//               variant="contained"
//               fullWidth
//               sx={{ mt: 2, bgcolor: "#B8860B" }}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//             {loginStatus && (
//               <Typography
//                 variant="body2"
//                 color={loginStatus === "Login successfull" ? "green" : "red"}
//                 align="center"
//                 sx={{ mt: 2 }}
//               >
//                 {loginStatus}
//               </Typography>
//             )}
//           </Box>

//           {isLoggedIn && <LogoutButton />}

//           <Box
//             justifyContent="space-between"
//             sx={{
//               mt: 1,
//               textDecoration: "none",
//               fontSize: "0.75rem",
//               fontFamily: "Lato",
//               fontWeight: 400,
//               lineHeight: 1.66,
//             }}
//           >
//             <Box component="span" sx={{ mr: 1 }}>
//               Don't have an account?
//             </Box>

//             <RouterLink to="/signup" onClick={toggleSignup}>
//               Register here.
//             </RouterLink>
//           </Box>
//         </Paper>
//       )}
//     </Container>
//   );
// };

// export default LoginComponent;
