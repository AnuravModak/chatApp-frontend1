import React from "react";
import { useWebSocket } from "./WebSocketProvider";

const OnlineUsers = () => {
  const { onlineUsers } = useWebSocket();

  return (
    <div>
      <h3>Online Users:</h3>
      <ul>
        {Array.from(onlineUsers).map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
