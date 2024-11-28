import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js'; // Import your MongoDB connection function
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';

// Import your custom routes using ES module syntax
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import negotiationRoutes from './routes/negotiationRoutes.js';
import notificationsRoutes from './routes/notifications.js'
import ratingRoutes from './routes/userRatingRoutes.js'
import cropsRoutes from './routes/cropRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json({ limit: '900mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

// Mount your custom routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/crops', cropsRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error details in development
  const errorResponse = {
    message: err.message,
    // Show error stack in development mode only
    error: req.app.get('env') === 'development' ? err.stack : {},
  };

  // Return JSON instead of rendering a view
  res.status(err.status || 500).json(errorResponse);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Connect to MongoDB
  connectDB(); // Call the function to connect to MongoDB
});

export default app;
