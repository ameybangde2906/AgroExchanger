// Import the Grain model
import {Grain, Vegetable}  from '../models/Crops.js'

// Fetch all grains
export const getAllGrains = async (req, res) => {
    try {
        const grains = await Grain.find(); // Fetch all grains
        res.status(200).json(grains);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grains", error: error.message });
    }
};

// Fetch grains by type
export const getGrainsByType = async (req, res) => {
    const { type } = req.query; // Get the type from query parameters
    try {
        const grains = await Grain.find({ type }); // Fetch grains with the specified type
        res.status(200).json(grains);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grains by type", error: error.message });
    }
};

// Fetch a single grain by name
export const getGrainByName = async (req, res) => {
    try {
        // Check if the `name` parameter exists
        if (!req.params.name) {
            // If no name is provided, fetch all grains
            const grains = await Grain.find();
            return res.status(200).json(grains);
        }

        // Create a case-insensitive regex for the provided name
        const searchKey = new RegExp(req.params.name, 'i');

        // Search for grains matching the name or other fields
        const grain = await Grain.find({
            "$or": [
                { name: { $regex: searchKey } },
                { marathi_name: { $regex: searchKey } },
                { marathi_english_name: { $regex: searchKey } },
            ]
        });

        // If no grain matches the filter, return a 404 response
        if (grain.length === 0) {
            return res.status(404).json({ message: "Grain not found" });
        }

        // Return the filtered results
        res.status(200).json(grain);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: "Error fetching grain by name", error: error.message });
    }
};


export const getVegetableByName = async (req, res) => {
    const searchKey = new RegExp(req.params.name, 'i'); // Get the grain name from URL params
    try {
        let vegetable = await Vegetable.find({
            "$or": [
                { marathi_english_name: { $regex: searchKey } },
                { name: { $regex: searchKey } },
                { marathi_name: { $regex: searchKey } },
                
            ]
        }).select('marathi_english_name name marathi_name'); 

        if (!vegetable) {
            return res.status(404).json({ message: "Grain not found" });
        }
        res.status(200).json(vegetable);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grain by name", error: error.message });
    }
};

