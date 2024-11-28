import express from 'express';
import {
  startNegotiation,
  getNegotiationsByOrder,
  updateNegotiation,
} from '../controllers/negotiationController.js';

const router = express.Router();

// Route to start a negotiation
router.post('/', startNegotiation);

// Route to get negotiations for a specific order
router.get('/order/:orderId', getNegotiationsByOrder);

// Route to update the status of a negotiation
router.put('/:negotiationId', updateNegotiation);

export default router;
