import React, { useState } from "react";
import * as ApiPath from "../utils/api.url";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { axiosWithLogin } from "../utils/api.client";

type UploadStatus = "idle" | "uploading" | "success" | "error";
const MAX_FILE_SIZE = 5 * 1024 * 1024; //  upto 5MB limit

// styled hidden input for file selection
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadFiles = () => {
  const [file, setFile] = useState<File | null>(null); // state for uploading files
  const [status, setStatus] = useState<UploadStatus>("idle"); // state for checking status
  const[fileError, setFileError]= useState<string>(""); // state for file size error

  // upload files logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if(selectedFile.size > MAX_FILE_SIZE){
        setFileError("File size exceeds the 5MB limit. ");
        setFile(null); // Reset file
      }else{
        setFile(selectedFile);
        setFileError(""); // clear previous error
      }
     
    }
  };

  const handleFileUpload = async () => {
    if (!file) return; // No file selected
    setStatus("uploading");

    const formData = new FormData();
    formData.append("url", " "); // Append other required fields
    formData.append("file", file);

    try {
      const fileUploadResponse = await axiosWithLogin.post(
        ApiPath.FILE_UPLOAD_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseObj = fileUploadResponse.data;
      console.log(responseObj.requestId);
      setStatus("success");
    } catch (error) {
      console.error(error); // Log the error for debugging
      setStatus("error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper sx={{ padding: 3, maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Upload File
        </Typography>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          fullWidth
        >
          Upload File
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
         {file && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2">
              File name: <strong>{file.name}</strong>
            </Typography>
            </Box>
         )}
            {/* <Typography variant="body2">
              Size: <strong>{(file.size / 1024).toFixed(2)} KB</strong>
            </Typography>
            <Typography variant="body2">
              Type: <strong>{file.type}</strong>
            </Typography>
          </Box>
        )} */}

        {file && status !== "uploading" && (
          <Box sx={{textAlign:"center", mb:2, mt:3}}>

          
          <Button variant="contained" onClick={handleFileUpload}
          sx={{
            fontSize:"1.2rem",
            mt:2,
          }}>
            Upload File
          </Button>
          </Box>
        )}

        {status === "uploading" && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginBottom: 2, }}
          >
            <CircularProgress />
          </Box>
        )}

        {status === "success" && (
          <Typography
            variant="body2"
            color="success.main"
            align="center"
            className="mt-2"
          >
            File uploaded successfully!
          </Typography>
        )}

        {status === "error" && (
          <Typography
            variant="body2"
            color="error.main"
            align="center"
            className="mt-2"
          >
            Upload failed. Please try again.
          </Typography>
        )}

        {fileError && (
          <Typography variant="body2" color="error.main" align="center" className="mt-2">
            {fileError}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UploadFiles;
