// Importing dependencies using ES Modules
import express from 'express';
import { registerUser, loginUser, logout, getMe } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

//Route to get user details
router.get('/me',protectRoute, getMe)

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to logout user 
router.post('/logout', logout)



// Export the router as default
export default router;
