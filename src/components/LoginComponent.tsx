import {
  Avatar,
  Box,
  Button,
  Container,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutLinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

type LoginComponentProps = {
  handleChange: (newValue: number) => void;
};

const LoginComponent = ({ handleChange }: LoginComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleSubmit = () => console.log("login");
  return (
    <Container maxWidth="xs">
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
            bgcolor: "#B8860B",
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
          color="textPrimary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Legal Portal Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Username"
            placeholder="Enter username"
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
            sx={{ mb: 1 }}
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
            sx={{ mt: 2, bgcolor: "#B8860B" }}
          >
            Login
          </Button>
        </Box>

        <Grid2 container justifyContent="space-between" sx={{ mt: 1 }}>
          <RouterLink
            to="/register"
            style={{
              textDecoration: "none",
              fontSize: "0.75rem",
              fontFamily: "Lato",
              fontWeight: 400,
              lineHeight: 1.66,
            }}
            onClick={() => handleChange(1)}
          >
            Don't have an account? Register here.
          </RouterLink>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default LoginComponent;
