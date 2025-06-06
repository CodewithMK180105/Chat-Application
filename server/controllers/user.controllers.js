import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";


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
            userData: newUser,
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
            userData: user,
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