"use client"

import type React from "react"
import { useState, useCallback } from "react"
import * as ApiPath from "../utils/api.url"
import {
  Box,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  AlertTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material"
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Article as ArticleIcon,
  Gavel as GavelIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { axiosWithLogin } from "../utils/api.client"

type UploadStatus = "idle" | "uploading" | "success" | "error"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]

// Styled components
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.dark,
  },
}))



const FilePreviewCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}))

const UploadFiles = () => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [fileError, setFileError] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [dragActive, setDragActive] = useState<boolean>(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndSetFile(e.target.files[0])
    }
  }

  // Validate file and set it if valid
  const validateAndSetFile = (selectedFile: File) => {
    // Reset states
    setFileError("")

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File size exceeds the 5MB limit.")
      setFile(null)
      return
    }

    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError("File type not supported. Please upload PDF, DOC, DOCX, or TXT files.")
      setFile(null)
      return
    }

    // File is valid
    setFile(selectedFile)
    setActiveStep(1)
  }

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) return

    setStatus("uploading")
    setActiveStep(2)

    const formData = new FormData()
    formData.append("url", " ")
    formData.append("file", file)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      const fileUploadResponse = await axiosWithLogin.post(ApiPath.FILE_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const responseObj = fileUploadResponse.data
      console.log(responseObj.requestId)

      setStatus("success")
      setActiveStep(3)
    } catch (error) {
      console.error(error)
      setStatus("error")
      setActiveStep(2) // Stay on upload step but show error
      setUploadProgress(0)
    }
  }

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }, [])

  // Reset the form
  const handleReset = () => {
    setFile(null)
    setStatus("idle")
    setFileError("")
    setUploadProgress(0)
    setActiveStep(0)
  }

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <PdfIcon color="error" fontSize="large" />
    if (fileType.includes("word") || fileType.includes("doc")) return <ArticleIcon color="primary" fontSize="large" />
    return <FileIcon color="info" fontSize="large" />
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: 2,
      }}
    >
      <Paper
        sx={{
          padding: { xs: 2, sm: 4 },
          maxWidth: 600,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
        elevation={3}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <GavelIcon
            sx={{
              fontSize: 36,
              mr: 2,
              color: theme.palette.primary.main,
            }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Legal Document Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload documents for legal analysis and processing
            </Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{ mb: 4 }}
        >
          <Step>
            <StepLabel>Select File</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review</StepLabel>
          </Step>
          <Step>
            <StepLabel>Upload</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        {/* File Selection Area */}
        {activeStep === 0 && (
          <>
            <UploadBox
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              sx={{
                backgroundColor: dragActive ? "action.hover" : "background.default",
                borderColor: dragActive ? "primary.main" : "primary.light",
                borderWidth: dragActive ? 3 : 2,
              }}
            >
              <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: "none" }} />
              <label htmlFor="file-upload" style={{ cursor: "pointer", display: "block" }}>
                <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop or Click to Upload
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Supported formats: PDF, DOC, DOCX, TXT
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum file size: 5MB
                </Typography>
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
                  Select File
                </Button>
              </label>
            </UploadBox>

            {fileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {fileError}
              </Alert>
            )}
          </>
        )}

        {/* File Review Area */}
        {activeStep === 1 && file && (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Review Your Document</AlertTitle>
              Please verify the document details before uploading
            </Alert>

            <FilePreviewCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {getFileIcon(file.type)}
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6" noWrap sx={{ maxWidth: "100%" }}>
                      {file.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      <Chip
                        size="small"
                        label={file.type.split("/")[1].toUpperCase()}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip size="small" label={formatFileSize(file.size)} color="secondary" variant="outlined" />
                    </Box>
                  </Box>
                  <Tooltip title="Remove file">
                    <IconButton onClick={handleReset} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </FilePreviewCard>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<DeleteIcon />}>
                Back
              </Button>
              <Button variant="contained" onClick={handleFileUpload} endIcon={<CloudUploadIcon />}>
                Upload Document
              </Button>
            </Box>
          </>
        )}

        {/* Upload Progress Area */}
        {activeStep === 2 && (
          <Box sx={{ textAlign: "center", my: 3 }}>
            {status === "uploading" ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Uploading Document...
                </Typography>
                <Box sx={{ width: "100%", mt: 2, mb: 3 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {Math.round(uploadProgress)}% Complete
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we upload and process your document
                </Typography>
              </>
            ) : (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Upload Failed</AlertTitle>
                There was an error uploading your document. Please try again.
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" onClick={handleReset} size="small">
                    Try Again
                  </Button>
                </Box>
              </Alert>
            )}
          </Box>
        )}

        {/* Success Area */}
        {activeStep === 3 && (
          <Box sx={{ textAlign: "center", my: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Document Successfully Uploaded!
            </Typography>
            <Typography variant="body1" paragraph>
              Your document has been uploaded and is now being processed by our legal AI system.
            </Typography>
            <Button variant="contained" onClick={handleReset} sx={{ mt: 2 }}>
              Upload Another Document
            </Button>
          </Box>
        )}

        {/* Information Section */}
        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
            <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
            Document Processing Information
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <DescriptionIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Accepted Document Types"
                secondary="PDF, DOC, DOCX, and TXT files are supported for legal analysis"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArticleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Document Processing"
                secondary="Documents are analyzed for legal terminology, clauses, and precedents"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GavelIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Legal AI Analysis"
                secondary="Our AI system will extract key legal information and provide insights"
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 2, backgroundColor: "info.light", p: 2, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              <HelpIcon sx={{ mr: 1, fontSize: 20 }} />
              Need help? Contact our support team for assistance with document uploads.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default UploadFiles
