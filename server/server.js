import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app=express();
const server=http.createServer(app); // we are using the http server because we need to use socket.io and socket.io supports only http server

// Initialize socket.io server
export const io= new Server(server, {
  cors: {origin: "*"}
});

// Store online users
export const userSocketMap= {}; // {userId: sockedId}

// Socket.io connection handler
io.on("connection", (socket)=> {
  const userId=socket.handshake.query.userId;
  console.log("User connected ", userId);

  if(userId) userSocketMap[userId]=socket.id;

  // Emit online users to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", ()=>{
    console.log("User disconnected ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})


// Middlewares setup
app.use(express.json({limit: "4mb"})); // Limit the request body size to 4mb, express.json() because all the request to be passed to server should be in json format
app.use(cors()); // Enable CORS for all routes
app.use("/api/status", (req, res)=> res.send("Server is running")); // Simple status endpoint
app.use("/api/auth", userRouter); // User authentication routes
app.use("/api/messages", messageRouter);

// Connect to the database
await connectDB(); // Connect to the MongoDB database


const PORT=process.env.PORT || 3000; // Use environment variable for port or default to 5000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});