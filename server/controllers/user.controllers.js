import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signUp= async (req, res) => {
    const  { email, fullName, password, bio } = req.body;

    try {
        if( !email || !fullName || !password || !bio ) {
            return res.json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.json({ 
                success: false, 
                message: "Email already exists" 
            });
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            bio
        });

        const token=generateToken(newUser._id);

        return res.json({
            success: true,
            user: newUser,
            token,
            message: "User created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const login= async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ 
                success: false, 
                message: "All fields are required" 
            });
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ 
                success: false, 
                message: "Invalid password" 
            });
        }

        const token = generateToken(user._id);
        return res.json({
            success: true,
            user,
            token,
            message: "Login successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// controller to check if the user is authenticated
export const checkAuth= async (req, res) => {
    res.json({
        success: true,
        user: req.user, // req.user is set by the protectedRoute middleware
        message: "User is authenticated",
    }); 
}

// controller to update the user profile details
export const updateProfile= async (req, res) => {
    try {
        const { fullName, profilePic, bio } = req.body;
        const userId = req.user._id; // req.user is set by the protectedRoute middleware

        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, bio },
                { new: true }
            );
        } else {
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, bio, profilePic: upload.secure_url },
                { new: true }
            );
        }

        res.json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}