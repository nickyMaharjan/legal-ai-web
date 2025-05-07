import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const cases = [
  { title: "View Document" },
  { title: "Legal Research" },
  { title: "Contract Review" },
  { title: "Need Further Articles" },
];

const CasesSection = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Function to load username from token
  const loadUsername = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUsername(decoded.sub || "");
      } catch (error) {
        console.error("Invalid token", error);
        setUsername("");
      }
    } else {
      setUsername("");
    }
  };

  useEffect(() => {
    loadUsername();
    window.addEventListener("tokenUpdated", loadUsername);

    return () => {
      window.removeEventListener("tokenUpdated", loadUsername);
    };
  }, []);

  return (
    <>
      <Container sx={{ mt: 4, textAlign: "center", maxWidth: "900px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#003366" }}>
          Welcome, {username ? username : "Guest"}!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, color: "#666" }}>
          Helping you with seamless legal research.
        </Typography>
      </Container>

      <Container sx={{ mt: 4, textAlign: "center", pr: 28 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#003366", mb: 3 }}
        >
          My Cases
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {cases.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: "12px",
                  boxShadow: 3,
                  padding: 2,
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: item.title === "View Document" ? "pointer" : "default",
                  "&:hover": item.title === "View Document" ? { boxShadow: 6 } : {},
                }}
                onClick={() => {
                  if (item.title === "View Document") {
                    navigate("/ViewDocs"); 
                  }
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#003366",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default CasesSection;
