import User from "../models/user.models.js";
import jwt from "jsonwebtoken";


// Middleware to protect routes
export const protectedRoute= async (req, res, next) => {
    try {
        const token=req.headers.token; // Get the token from the request headers

        const decoded=jwt.verify(token, process.env.JWT_SECRET); // Verify the token using JWT secret

        const user=await User.findById(decoded.userId).select("-password"); // Find the user by token

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or unauthorized",
            });
        }

        req.user=user; // Attach the user to the request object
        next(); // Call the next middleware or route handler

    } catch (error) {
        res.json({
            success: false,
            message: error.message,
            error: error.message,
        });
    }
}