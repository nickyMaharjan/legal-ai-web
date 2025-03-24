import React from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";

const cases = [
  { title: "View Document" },
  { title: "Legal Research" },
  { title: "Contract Review" },
  { title: "Need Further Articles" },
];

const CasesSection = ({}) => {
  return (
    <>
      <Container sx={{ mt: 4, textAlign: "center", maxWidth: "900px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#003366" }}>
          Welcome, @Your Name!
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
