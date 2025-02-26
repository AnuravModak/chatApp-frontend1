import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [messages, setMessages] = useState([]);  // Store incoming messages

  useEffect(() => {
    console.log("Initializing WebSocket connection...");

    if (stompClientRef.current) {
      console.log("WebSocket already initialized.");
      return;
    }

    const token = localStorage.getItem("jwt");
    const username = localStorage.getItem("username");

    if (!token || !username) 
      {console.log("username or token is null ", token, username);
      return;}

    const socket = new SockJS("http://192.168.0.170:8080/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${token}`, username },

      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        // ✅ Subscribe to online users
        client.subscribe("/topic/online-users", (message) => {
          const users = new Set(JSON.parse(message.body));
          console.log("Updated online users:", users);
          setOnlineUsers(users);
        });

        // ✅ Subscribe to messages sent to the user
        client.subscribe(`/user/queue/messages`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("📩 New message received:", receivedMessage);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        // Notify the backend that this user is online
        client.publish({
          destination: "/app/user-online",
          body: JSON.stringify({ username }),
        });
      },

      onDisconnect: () => console.log("⚠️ Disconnected from WebSocket"),
      onStompError: (frame) => console.error("❌ WebSocket Error:", frame),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      console.log("🛑 Cleaning up WebSocket connection...");
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ onlineUsers, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);