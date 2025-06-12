import express from 'express';
import { checkAuth, login, signUp, updateProfile } from '../controllers/user.controllers.js';
import { protectedRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectedRoute, updateProfile);
userRouter.get('/check', protectedRoute, checkAuth);

export default userRouter;
// This code defines the user routes for signup, login, profile update, and authentication check.