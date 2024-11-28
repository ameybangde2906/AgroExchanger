import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "name profileImg"
        }).populate({
            path: "order",
        });

        await Notification.updateMany({ tp: userId }, { read: true });

        res.status(200).json(notification);
    } catch (error) {
        console.log("erro in notification function", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}