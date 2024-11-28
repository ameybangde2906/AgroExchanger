import Rating from "../models/UserRating.js";
import User from "../models/User.js";

// Add a new rating
export const addRating = async (req, res) => {
    try {
        const { rating } = req.body;

        // Check if the recipient and giver exist
        const from = req.user._id;
        const to = req.params.id;

        const giver = await User.findById(from);
        const recipient = await User.findById(to)

        if (!giver || !recipient) {
            return res.status(404).json({ message: "User or rating giver not found" });
        }

        // Create a new rating
        const newRating = new Rating({
            to, from, rating
        });

        await newRating.save();

        res.status(201).json({ message: "Rating added successfully", rating: newRating });
    } catch (error) {
        res.status(500).json({ message: "Error adding rating", error: error.message });
    }
};

// Get all ratings for a specific user (recipient)
export const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params.id;
        const userRatings = await Rating.find({ userId }).populate('from', 'fullName');

        res.status(200).json({ userRatings });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving ratings", error: error.message });
    }
};

// Update a rating
export const updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating, comment } = req.body;

        const updatedRating = await Rating.findByIdAndUpdate(
            ratingId,
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!updatedRating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        res.status(200).json({ message: "Rating updated successfully", rating: updatedRating });
    } catch (error) {
        res.status(500).json({ message: "Error updating rating", error: error.message });
    }
};

// Delete a rating
export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;

        const deletedRating = await Rating.findByIdAndDelete(ratingId);
        if (!deletedRating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting rating", error: error.message });
    }
};
