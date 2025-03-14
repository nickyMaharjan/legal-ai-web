import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  Paper,
  Box,
  Breadcrumbs,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import results from "../json/results-example";
import axios from "axios";
import * as ApiPath from "../utils/api.url";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const SearchSection = () => {
  const [search, setSearch] = useState(""); // Main search state
  const [filteredData, setFilteredData] = useState(results.results);
  const [showPreview, setShowPreview] = useState(false); // State for preview mode
  const [previewSearch, setPreviewSearch] = useState(""); // State for preview search input
  const [file, setFile] = useState<File | null>(null); // State for uploading file
  const [status, setStatus] = useState<UploadStatus>("idle"); // state for checking status

  // Upload files logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setStatus("uploading");

    const formData = new FormData();
    formData.append("url", "https://google.com/pdf-viewer");
    formData.append("file", file);

    try {
      const fileUploadResponse = await axios.post(
        ApiPath.FILE_UPLOAD_URL,
        formData,
      );
      const responseObj = fileUploadResponse.data;
      console.log(responseObj.requestId);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // Fetch results from the backend
  const fetchResults = async (searchTerm: string) => {
    try {
      const response = await axios.get(ApiPath.SEARCH_URL, {
        headers: { "Content-Type": "application/json" },
        params: { query: searchTerm }, // Assuming search query is passed as a parameter
      });
      setFilteredData(response.data.results || []); // Update filtered data with response
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredData([]); // Handle error by clearing the filtered data
    }
  };

  // Main Search Logic
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm); // Update main search term
    // fetchResults(searchTerm);

    // Filtering data immediately as the user types in the search box
    const filtered = results.results.filter((item) =>
      item.data.title.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handleSetPreview = () => {
    if (search.trim()) {
      // Check if there is a search term
      setShowPreview(true);
      setPreviewSearch(search);
    } else {
      alert("Please enter a search term before setting preview.");
    }
  };

  const handleBackToSearch = () => {
    setShowPreview(false);
    setPreviewSearch(search);
  };

  const handleSubmit = async () => {
    await fetchResults(search);
  }

  const handlePreviewSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const previewSearchTerm = e.target.value.toLowerCase();
    setPreviewSearch(previewSearchTerm);

    const filtered = results.results.filter((item) =>
      item.data.title.toLowerCase().includes(previewSearchTerm)
    );
    setFilteredData(filtered);
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center", maxWidth: "900px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#003366" }}>
        Welcome, @Your Name!
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#666" }}>
        Helping you with seamless legal research.
      </Typography>

      {/* Declaring files */}
      <div className="space-y-4">
        <input type="file" onChange={handleFileChange} />
        {file && (
          <div className="mb-4 text-sm">
            <p>File name: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>Type:{file.type}</p>
          </div>
        )}
        {file && status !== "uploading" && (
          <button onClick={handleFileUpload}>Upload file</button>
        )}

        {status === "success" && (
          <p className="mt-2 text-sm text-green-600">
            File uploaded successfully!
          </p>
        )}

        {status === "error" && (
          <p className="mt-2 text-sm text-red-600">
            Upload failed. Please try again.
          </p>
        )}
      </div>

      {!showPreview ? (
        <>
          <TextField
            fullWidth
            placeholder="Start your legal research"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            sx={{ mt: 2, backgroundColor: "#fff", borderRadius: "8px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              backgroundColor: "#003366",
              borderRadius: "8px",
              padding: "10px 20px",
            }}
          >
            Search
          </Button>
        </>
      ) : (
        <>
          {/* Breadcrumbs Implementation */}
          <Breadcrumbs separator="/" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{
                color: "#003366",
                fontSize: "1rem",
              }}
              onClick={handleBackToSearch}
            >
              Back to Search
            </Link>

            <Typography color="#003366" fontSize={"1rem"}>
              Preview
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{ display: "flex", justifyContent: "center", mb: 2 }}
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              placeholder="Search legal...."
              value={previewSearch}
              onChange={handlePreviewSearchChange}
              variant="outlined"
              sx={{
                width: "50%",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                "& .MuiInputBase-input": {
                  padding: "6px 10px",
                  fontSize: "14px",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {filteredData.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#666" }}>
              No results found.
            </Typography>
          ) : (
            filteredData.map((item) => (
              <Paper
                sx={{ p: 3, mb: 2, textAlign: "left" }}
                key={item._metadata.docId}
              >
                <Typography variant="h6">{item.data.title}</Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  <strong>Section: </strong>
                  {item.data.section}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>HTML Link: </strong>
                  <a
                    href={item.data.html}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.data.html}
                  </a>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, display: "flex", alignItems: "center" }}
                >
                  <strong>PDF Link: </strong>&nbsp;
                  <a
                    href={item.data.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.data.pdf}
                    <IconButton
                      sx={{ ml: 1 }}
                      onClick={() => window.open(item.data.pdf, "_blank")}
                      aria-label="open pdf"
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </a>
                </Typography>
              </Paper>
            ))
          )}
          <Button
            variant="outlined"
            sx={{ mt: 2, borderRadius: "8px", padding: "10px 20px" }}
            onClick={handleBackToSearch}
          >
            Back to Search
          </Button>
        </>
      )}
    </Container>
  );
};

export default SearchSection;
