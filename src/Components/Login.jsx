import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.0.170:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // ✅ Send entered username/password
      });
  
      if (response.ok) {
        const token = await response.text(); // ✅ Read token as text
  
        if (!token) {
          console.error("❌ Missing token in response");
          return;
        }
  
        // ✅ Store JWT token and username in localStorage
        localStorage.setItem("jwt", token.trim());
        localStorage.setItem("username", username.trim()); // ✅ Use entered username
  
        // ✅ Redirect to user list page
        navigate("/users");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
