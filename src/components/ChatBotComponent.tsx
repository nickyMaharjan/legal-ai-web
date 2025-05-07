"use client";

import React, { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";
import {
  IconButton,
  Dialog,
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  Avatar,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
  Slide,
} from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PsychologyIcon from "@mui/icons-material/Psychology";
import * as ApiPath from "../utils/api.url";
import { axiosWithLogin } from "../utils/api.client";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Message = {
  id: string;
  text: string;
  reasoning?: string;
  from: "user" | "bot";
  timestamp: string;
  status: "pending" | "error" | "success" | "initial";
  file?: {
    name: string;
    type: string;
    size: number;
    url?: string;
  };
  showReasoning?: boolean;
};

const SUGGESTED_PROMPTS = [
  "What are my rights as a tenant?",
  "Explain contract termination clauses",
  "How do I file a small claims case?",
  "What is the difference between a will and a trust?",
  "Explain intellectual property rights",
  "What should I do after a car accident?",
];

const ChatBotComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text: "Welcome to the Legal AI Assistant",
      from: "bot",
      timestamp: new Date().toLocaleTimeString(),
      status: "initial",
    },
    {
      id: "welcome-2",
      text: "I'm here to help with your legal questions. You can ask me about contracts, rights, regulations, or any other legal matters.",
      from: "bot",
      timestamp: new Date().toLocaleTimeString(),
      status: "initial",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatbotEnabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (openChat) {
      scrollToBottom();
    }
  }, [messages, openChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleReasoning = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, showReasoning: !msg.showReasoning }
          : msg
      )
    );
  };

  const sendMessage = async (
    message: string,
    controller: AbortController,
    file?: File
  ) => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("q", message);
        formData.append("file", file);

        const response = await axiosWithLogin.post(
          `${ApiPath.DOC_CHATBOT_URL}`,
          formData,
          {
            signal: controller.signal,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response;
      } else {
        const response = await axiosWithLogin.get(
          `${ApiPath.CHATBOT_URL}?q=${encodeURIComponent(message)}`,
          {
            signal: controller.signal,
          }
        );
        return response;
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sending message:", error);
        throw error;
      }
      return null;
    }
  };

  const handleSendMessage = (text = userInput) => {
    if ((!text.trim() && !selectedFile) || !isChatbotEnabled) return;

    const messageId = `msg-${Date.now()}`;
    const messageText =
      text.trim() ||
      (selectedFile ? `Analyzing document: ${selectedFile.name}` : "");

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        text: messageText,
        from: "user",
        timestamp: new Date().toLocaleTimeString(),
        status: "initial",
        file: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
            }
          : undefined,
      },
    ]);

    const controller = new AbortController();
    setAbortController(controller);
    setIsTyping(true);

    sendMessage(text, controller, selectedFile || undefined)
      .then((res) => {
        if (res) {
          setMessages((prev) => [
            ...prev,
            {
              id: `response-${messageId}`,
              text: res.data.answer,
              reasoning: res.data.think || "",
              from: "bot",
              timestamp: new Date().toLocaleTimeString(),
              status: "success",
              showReasoning: false,
            },
          ]);
        }
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${messageId}`,
            text: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
            from: "bot",
            timestamp: new Date().toLocaleTimeString(),
            status: "error",
          },
        ]);
        console.error("Chat error:", err);
      })
      .finally(() => {
        setIsTyping(false);
        setAbortController(null);
        setSelectedFile(null);
      });

    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setUserInput(prompt);
    handleSendMessage(prompt);
  };

  const handleClose = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setOpenChat(false);
    setSelectedFile(null);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "How can I assist you with your legal questions today?",
        from: "bot",
        timestamp: new Date().toLocaleTimeString(),
        status: "initial",
      },
    ]);
    setSelectedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      event.target.value = "";
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Chat with Legal AI" placement="left">
          <IconButton
            onClick={() => setOpenChat(true)}
            sx={{
              backgroundColor: "#003366",
              color: "white",
              boxShadow: 3,
              width: 56,
              height: 56,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#004080",
                transform: "scale(1.05)",
              },
            }}
          >
            <ChatIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        fullScreen
        open={openChat}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            bgcolor: "#f8f9fa",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#003366",
              color: "white",
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GavelIcon sx={{ mr: 1.5 }} />
              <Typography variant="h6">Legal AI Assistant</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleClearChat}
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                New Chat
              </Button>

              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              p: { xs: 0, sm: 2 },
              maxWidth: "1200px",
              width: "100%",
              mx: "auto",
            }}
          >
            <Paper
              elevation={isMobile ? 0 : 1}
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: isMobile ? 0 : 2,
                border: isMobile ? "none" : "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: "auto",
                  p: { xs: 2, sm: 3 },
                  bgcolor: "white",
                }}
              >
                <Container maxWidth="md" sx={{ py: 1 }}>
                  {messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems:
                          msg.from === "user" ? "flex-end" : "flex-start",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection:
                            msg.from === "user" ? "row-reverse" : "row",
                          alignItems: "flex-start",
                          gap: 1.5,
                          maxWidth: "85%",
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor:
                              msg.from === "user" ? "#003366" : "#00796b",
                            width: 38,
                            height: 38,
                          }}
                        >
                          {msg.from === "user" ? (
                            <PersonIcon />
                          ) : (
                            <SmartToyIcon />
                          )}
                        </Avatar>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor:
                              msg.from === "user" ? "#e3f2fd" : "#f5f5f5",
                            maxWidth: "100%",
                            wordBreak: "break-word",
                          }}
                        >
                          {msg.file && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1,
                                mb: 1.5,
                                bgcolor: "rgba(0, 0, 0, 0.04)",
                                borderRadius: 1,
                              }}
                            >
                              <DescriptionIcon
                                color="primary"
                                fontSize="small"
                              />
                              <Box sx={{ overflow: "hidden" }}>
                                <Typography variant="body2" noWrap>
                                  {msg.file.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {(msg.file.size / 1024).toFixed(1)} KB
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          <Typography
                            component="div"
                            variant="body1"
                            sx={{ lineHeight: 1.6 }}
                          >
                            <Markdown>{msg.text}</Markdown>
                          </Typography>

                          {msg.from === "bot" && msg.reasoning && (
                            <Box sx={{ mt: 2 }}>
                              <Button
                                size="small"
                                startIcon={<PsychologyIcon fontSize="small" />}
                                onClick={() => toggleReasoning(msg.id)}
                                sx={{
                                  textTransform: 'none',
                                  color: theme.palette.primary.main,
                                  fontSize: '0.75rem',
                                  p: 0,
                                  minWidth: 0,
                                }}
                              >
                                {msg.showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
                              </Button>
                              
                              {msg.showReasoning && (
                                <Paper
                                  elevation={0}
                                  sx={{
                                    mt: 1,
                                    p: 2,
                                    bgcolor: '#f9f9f9',
                                    borderLeft: `3px solid ${theme.palette.primary.light}`,
                                  }}
                                >
                                  <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
                                    <Markdown>{msg.reasoning}</Markdown>
                                  </Typography>
                                </Paper>
                              )}
                            </Box>
                          )}

                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "text.secondary",
                              mt: 1,
                              textAlign: "right",
                            }}
                          >
                            {msg.timestamp}
                          </Typography>
                        </Paper>
                      </Box>

                      {msg.status === "error" && (
                        <Typography
                          variant="caption"
                          sx={{ color: "error.main", mt: 0.5 }}
                        >
                          Error occurred
                        </Typography>
                      )}
                    </Box>
                  ))}

                  {isTyping && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        ml: 1,
                        mb: 3,
                      }}
                    >
                      <Avatar
                        sx={{ bgcolor: "#00796b", width: 38, height: 38 }}
                      >
                        <SmartToyIcon />
                      </Avatar>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CircularProgress
                          size={16}
                          thickness={5}
                          color="primary"
                        />
                        <Typography variant="body2">
                          Analyzing your question...
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <div ref={messagesEndRef} />
                </Container>
              </Box>

              {messages.length <= 2 && !isTyping && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LightbulbIcon fontSize="small" sx={{ color: "#f9a825" }} />
                    Suggested Questions
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <Chip
                        key={index}
                        label={prompt}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        sx={{
                          bgcolor: "#f0f7ff",
                          borderColor: "#cce5ff",
                          "&:hover": { bgcolor: "#d6ebff" },
                          mb: 1,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {messages.length <= 2 && !isTyping && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8f9fa",
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <DescriptionIcon sx={{ mr: 1, color: "#003366" }} />
                            <Typography variant="subtitle1">
                              Document Analysis
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Upload legal documents for AI analysis and
                            explanation
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <GavelIcon sx={{ mr: 1, color: "#003366" }} />
                            <Typography variant="subtitle1">
                              Case Research
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Find relevant case law and legal precedents
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <PsychologyIcon sx={{ mr: 1, color: "#003366" }} />
                            <Typography variant="subtitle1">
                              Reasoning Explanations
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Ask the AI to explain its reasoning for any answer
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                {selectedFile && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      mb: 2,
                      bgcolor: "#f0f7ff",
                      borderRadius: 1,
                      border: "1px dashed #90caf9",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DescriptionIcon color="primary" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={handleRemoveFile}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                  />

                  <Tooltip title="Upload document">
                    <IconButton
                      onClick={handleFileButtonClick}
                      disabled={!isChatbotEnabled || isTyping}
                      sx={{
                        bgcolor: "#f5f5f5",
                        "&:hover": { bgcolor: "#e0e0e0" },
                      }}
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>

                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={
                      isChatbotEnabled
                        ? selectedFile
                          ? "Add a message about this document..."
                          : "Ask your legal question..."
                        : "Assistant is turned off. Toggle the switch to reactivate."
                    }
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={4}
                    disabled={!isChatbotEnabled}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Tooltip title="Send message">
                    <Button
                      variant="contained"
                      onClick={() => handleSendMessage()}
                      disabled={
                        (!userInput.trim() && !selectedFile) ||
                        !isChatbotEnabled ||
                        isTyping
                      }
                      sx={{
                        bgcolor: "#003366",
                        borderRadius: 2,
                        minWidth: 56,
                        height: 56,
                        "&:hover": {
                          bgcolor: "#004080",
                        },
                      }}
                    >
                      <SendIcon />
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ChatBotComponent;