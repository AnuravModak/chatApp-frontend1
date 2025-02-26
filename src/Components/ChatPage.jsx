import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchMessagesBetweenUsers, sendMessage } from "../Routers/api";
import { useWebSocket } from "./WebSocketProvider";
import { Box, TextField, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatPage = () => {
  const location = useLocation();
  const { senderId, receiverId, username } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { onlineUsers, messages: websocketMessages } = useWebSocket();

  useEffect(() => {
    if (!senderId || !receiverId) {
      console.error("❌ Missing senderId or receiverId.");
      return;
    }

    

    // ✅ Fetch previous messages from the database (only once)
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessagesBetweenUsers(senderId, receiverId);
        setMessages(fetchedMessages.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    loadMessages();
  }, [senderId, receiverId]);

  // ✅ Update messages when a new message arrives via WebSocket
  useEffect(() => {
    setMessages((prev) => [...prev, ...websocketMessages]);
  }, [websocketMessages]);

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("🟢 Online Users:", onlineUsers);
    console.log("Checking Online Status for:", receiverId);
    console.log("Is Receiver Online?", onlineUsers.has(receiverId));
  }, [onlineUsers, receiverId]);

  // ✅ Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() && senderId && receiverId) {
      const message = { sender: senderId, receiver: receiverId, content: newMessage };
      try {
        await sendMessage(message);
        setMessages((prev) => [...prev, message]); // Append to local state
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "600px", margin: "auto" }}>
      {!senderId || !receiverId ? (
        <Typography variant="h6" color="error">❌ Error: Missing sender or receiver ID</Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Chat with {username} {onlineUsers.has(username) ? "🟢 Online" : "⚪ Offline"}
          </Typography>

          <List sx={{ maxHeight: 400, overflowY: "auto", marginBottom: 2 }}>
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ justifyContent: message.sender === senderId ? "flex-end" : "flex-start" }}>
                <ListItemText
                  primary={message.content}
                  sx={{
                    backgroundColor: message.sender === senderId ? "#dcf8c6" : "#ffffff",
                    borderRadius: 2,
                    padding: 1,
                    maxWidth: "80%",
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField label="Type a message..." fullWidth value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatPage;
