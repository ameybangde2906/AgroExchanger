import express from "express";
import { getLatLonFromAddress, getLocation, getLocationSuggestions, getProfileCompletion, updateUserProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post('/update',protectRoute, updateUserProfile);
router.get('/profile-completion',protectRoute, getProfileCompletion)
router.post('/location', getLocation)
router.post('/lat', getLatLonFromAddress)
router.get('/sugg', getLocationSuggestions)

export default router;