import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

    },
    { timestamps: true }
)

const Rating = mongoose.model('Rating', RatingSchema)
export default Rating;