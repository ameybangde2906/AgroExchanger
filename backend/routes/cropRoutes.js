import express from 'express'
import { getAllGrains, getGrainByName, getGrainsByType, getVegetableByName } from '../controllers/cropsController.js';

const router = express.Router();

// Route to fetch all grains
router.get("/", getAllGrains);

// Route to fetch grains by type (e.g., "Cereal Grain")
router.get("/type", getGrainsByType);

// Route to fetch a single grain by name (e.g., "Rice")
router.get("/grains/:name", getGrainByName);

router.get("/vegetables/:name", getVegetableByName);



export default router;
