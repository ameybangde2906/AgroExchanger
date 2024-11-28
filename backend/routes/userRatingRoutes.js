import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { addRating, getUserRatings } from '../controllers/userRatingController.js';

const router = express.Router();

router.post('/:id', protectRoute, addRating);               // Add a rating
router.get('/ratings/:id', protectRoute, getUserRatings );       // Get all ratings for a user
router.put('/ratings/:ratingId', protectRoute);   // Update a rating
router.delete('/ratings/:ratingId');

export default router