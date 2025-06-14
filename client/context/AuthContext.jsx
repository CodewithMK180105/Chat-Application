// context/AuthContext.js

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// ✅ Setup backend URL and axios base
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ NEW: Add loading state to block render until auth check completes
  const [loading, setLoading] = useState(true);

  // ✅ Check user authentication from backend
  const checkAuth = async (showToast = true) => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      if (showToast && error.code !== "ERR_NETWORK") {
        toast.error(error.message || "Authentication check failed");
      } else if (showToast) {
        console.error("Network error during auth check:", error);
      }
    } finally {
      // ✅ Mark auth loading as complete no matter what
      setLoading(false);
    }
  };

  // 🔐 Handle login/signup and store token
  const login = async (state, credentials) => {
    try {
      console.log(state, credentials);
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🚪 Handle logout and socket cleanup
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");

    // ✅ Only disconnect if socket exists
    if (socket) socket.disconnect();
  };

  // 🔧 Handle profile update
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    }
  };

  // 🔌 Establish socket connection
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineusers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // ✅ Run on initial mount if token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth(); // Run auth check and populate user state
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* ✅ Only render children after auth check is complete */}
      {!loading ? children : <div className="text-white text-center mt-10">Loading...</div>}
    </AuthContext.Provider>
  );
};
