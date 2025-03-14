const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/sales", async (req, res) => {
  try {
    const response = await axios.get(
      "https://my.api.mockaroo.com/sales.json?key=a0969580"
    );
    res.status(200).json({ status: "Success", data: response.data });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

module.exports = app;


