import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WebSocketProvider } from "./Components/WebSocketProvider";
import Login from "./Components/Login";
import OnlineUsers from "./Components/OnlineUsers";

const App = () => {
  return (
    <Router>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/online-users" element={<ProtectedRoute component={OnlineUsers} />} />
        </Routes>
      </WebSocketProvider>
    </Router>
  );
};

// Redirects to login if no JWT is found
const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem("jwt");
  return token ? <Component /> : <Navigate to="/" />;
};

export default App;
