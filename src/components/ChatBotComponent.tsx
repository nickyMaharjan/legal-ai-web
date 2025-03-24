import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import {
  IconButton,
  Dialog,
  DialogContent,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";

import { teal } from "@mui/material/colors";
import axios from "axios";
import * as ApiPath from "../utils/api.url";
import Tooltip from "@mui/material/Tooltip";

type Message = {
  text: string;
  from: "user" | "bot";
  timestamp: string;
  status: "pending" | "error" | "success" | "initial";
};

const ChatBotComponent = () => {
  let abortController: AbortController | undefined = undefined;
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Welcome to the LegalChatBot!",
      from: "bot",
      timestamp: new Date().toLocaleTimeString(),
      status: "initial",
    },
    {
      text: "How can I assist you today?",
      from: "bot",
      timestamp: new Date().toLocaleTimeString(),
      status: "initial",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [openChat, setOpenChat] = useState(false);

  const sendMessage = async (
    message: string,
    abortController: AbortController
  ) => {
    const response = await axios.get(ApiPath.CHATBOT_URL + "?q=" + message, {
      signal: abortController.signal,
    });
    return response;
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([
        ...messages,
        {
          text: userInput,
          from: "user",
          timestamp: new Date().toLocaleTimeString(),
          status: "pending",
        },
      ]);
      setUserInput("");
    }
  };

  // for entering in the keyboard--
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage();
    }
  };

  useEffect(() => {
    const recentMsg = messages[messages.length - 1];
    if (recentMsg?.from === "user" && recentMsg.status === "pending") {
      abortController = new AbortController();

      // Send message to chatbot and handle response
      sendMessage(recentMsg.text, abortController)
        .then((res) => {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              text: recentMsg.text, // User's message
              from: "user",
              timestamp: recentMsg.timestamp,
              status: "initial", // No status for user message
            },

            {
              text: res.data.answer, // Bot's response
              from: "bot",
              timestamp: new Date().toLocaleTimeString(),
              status: "success",
            },
          ]);
        })
        .catch((err) => {
          //  To check handle error case and update status
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              text: recentMsg.text,
              from: "user",
              timestamp: recentMsg.timestamp,
              status: "initial", // No status for user message
            },
            {
              text: "Sorry, something went wrong. Please try again.",
              from: "bot",
              timestamp: new Date().toLocaleTimeString(),
              status: "error", // Error for bot response
            },
          ]);
          console.error(err);
        });
    }

    return () => abortController?.abort();
  }, [messages]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tooltip title="Chat with AI" placement="bottom-start">
          <IconButton
            sx={{
              backgroundColor: "#003366",
              color: "white",
              boxShadow: 3,
              borderRadius: "50%",
              cursor: "pointer",

              "&:hover": { backgroundColor: "#005599" },
            }}
            onClick={() => setOpenChat(true)}
          >
            <MarkUnreadChatAltOutlinedIcon sx={{ fontSize: 35 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog open={openChat} onClose={() => setOpenChat(false)} fullScreen>
        <DialogContent sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: teal[500], fontWeight: "bold" }}
            >
              LegalChatBot
            </Typography>
          </Box>

          <Box
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "12px",
              padding: 2,
              mb: 2,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    backgroundColor:
                      msg.from === "user" ? teal[500] : "grey.300",
                    color: msg.from === "user" ? "white" : "black",
                    borderRadius: "16px",
                    padding: "8px 12px",
                    maxWidth: "70%",
                  }}
                >
                  <Markdown>{msg.text}</Markdown>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "gray", mt: 0.5 }}
                >
                  {msg.timestamp}
                </Typography>

                {/* To display status under each message */}
                {msg.status === "pending" && (
                  <Typography variant="caption" sx={{ color: "#5F9EA0" }}>
                    pending..
                  </Typography>
                )}
                {msg.status === "error" && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    Error occurred. Please try again.
                  </Typography>
                )}
                {msg.status === "success" && (
                  <Typography variant="caption" sx={{ color: "green" }}>
                    success
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown} // for entering through the keyboard
            sx={{
              borderRadius: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            slotProps={{
              input: {
                style: { fontSize: "1rem", padding: "12px" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: teal[500],
              "&:hover": { backgroundColor: teal[700] },
              padding: "12px",
              fontWeight: "600",
              borderRadius: "12px",
            }}
            onClick={handleSendMessage}
          >
            Send
          </Button>

          <Button
            onClick={() => setOpenChat(false)}
            fullWidth
            sx={{
              mt: 1,
              color: teal[500],
              fontWeight: "600",
              fontSize: "1.1rem",
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBotComponent;
