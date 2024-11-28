import express from 'express';
import {
  createOrder,
  deleteOrder,
  getOrders,
  getOrdersBySeller,
  getProductById,
  getUniqueProductNamesByCategory,
  searchSuggestion,
} from '../controllers/orderController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Route to create a new order
router.post('/', protectRoute, createOrder);

// Route to fetch all orders
router.get('/', getOrders);

router.get('/product/:id', getProductById)

router.get('/orderlist', getUniqueProductNamesByCategory)

// Route to fetch orders by seller ID
router.get('/seller', protectRoute, getOrdersBySeller);

router.get('/search/:key', searchSuggestion)

router.delete('/delete/:id', protectRoute, deleteOrder)

export default router;
