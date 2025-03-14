import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";

const Sidebar = () => {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
      }}
    >
      {/* Help Icon Button */}
      <IconButton
        size="large"
        onClick={() => setWelcomeOpen(true)}
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          color: "#003366",
          "&:hover": { color: "#0055cc" },
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      {/* Welcome Dialog */}
      <Dialog
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Welcome to the Legal Chatbot</DialogTitle>
        <DialogContent>
          <Typography>Click below to access help and search.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWelcomeOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setWelcomeOpen(false);
              setHelpOpen(true);
            }}
          >
            Help and Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help and Search Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Help and Search</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="State Name"
            variant="outlined"
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Search Laws"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
