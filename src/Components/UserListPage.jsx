import React, { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import "../Styles/UserListPage.css"; // Import CSS file

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const { onlineUsers } = useWebSocket(); // WebSocket live updates

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("❌ Missing authentication token.");
        return;
      }

      try {
        const response = await fetch("http://192.168.0.170:8080/api/users/admin/all/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // ✅ Merge online status from WebSocket with DB users
        const updatedUsers = data.map((user) => ({
          ...user,
          isOnline: onlineUsers.has(user.username), // Set online status dynamically
        }));

        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // ✅ Update online status dynamically whenever onlineUsers change
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        isOnline: onlineUsers.has(user.username),
      }))
    );
  }, [onlineUsers]); // Runs every time `onlineUsers` updates

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <div className="user-grid">
        {users.map((user) => (
          <Card key={user.id} className="user-card">
            <CardContent>
              <Avatar className={`avatar ${user.isOnline ? "online" : "offline"}`}>
                {user.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="h6">{user.username}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.email}
              </Typography>
              <span className={`status ${user.isOnline ? "online" : "offline"}`}>
                {user.isOnline ? "🟢 Online" : "🔴 Offline"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;
