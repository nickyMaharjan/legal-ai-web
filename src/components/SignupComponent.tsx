import {
  Avatar,
  Button,
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

const SignupComponent = () => {
  const paperStyle = { padding: "30px 20px", width: 310, margin: "17px auto" };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#B8860B" };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <Grid2>
      <Paper elevation={20} style={paperStyle}>
        <Grid2 justifyItems="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h1 style={headerStyle}>Register Now</h1>
          <Typography variant="caption" gutterBottom>
            Please fill this form to create an account !
          </Typography>
        </Grid2>

        <form>
          <TextField
            label="Name"
            placeholder="Enter your name"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            label="Email"
            placeholder="Enter your email"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            label="Phone Number"
            placeholder="Enter your number"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            placeholder="Enter your password"
            fullWidth
            required
            autoFocus
            type={showPassword ? "text" : "password"}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
          />

          <TextField
            label="Confirm Password"
            placeholder="Enter your confirm password"
            fullWidth
            required
            autoFocus
            type={showConfirmPassword ? "text" : "password"}
            sx={{ mb: 2 }}
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
              control={<Checkbox name="checkedB" color="primary" />}
              label="I accept the terms and conditions."
              sx={{ alignSelf: "start" }}
            />
          </FormGroup>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 2 , bgcolor:"#B8860B"}}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Grid2>
  );
};

export default SignupComponent;
