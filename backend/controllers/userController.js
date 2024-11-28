import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    const { name, userType, mobileNumber, address, aadharNumber, panNumber, gstNumber, dob, gender, latitude, longitude, place } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });


        user.name = name || user.name;
        user.userType = userType || user.userType;
        user.mobileNumber = mobileNumber || user.mobileNumber;
        user.dob = dob || user.dob;
        user.gender = gender || user.gender;
        user.address = { ...user.address, ...address }
        user.aadhar.number = aadharNumber || user.aadhar.number;
        user.pan.number = panNumber || user.pan.number;
        user.gstNumber = gstNumber || user.gstNumber;
        user.currentLocation.latitude = latitude || user.currentLocation.latitude;
        user.currentLocation.longitude = longitude || user.currentLocation.longitude;
        user.currentLocation.address = place || user.currentLocation.address;

        user = await user.save();

        user.password = null

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser:", error.message);
        res.status(500).json({ error: error.message })
    }
}


export const getProfileCompletion = async (req, res) => {
    const calculateProfileCompletion = (user) => {
        const totalFields = 15; // Total number of fields to complete
        let filledFields = 0;

        // Check top-level fields
        if (user.name) filledFields++;
        if (user.mobileNumber) filledFields++;
        if (user.dob) filledFields++;
        if (user.gender) filledFields++;
        if (user.userType) filledFields++;
        if (user.aadhar.number) filledFields++;
        if (user.pan.number) filledFields++;

        // Check address sub-fields
        if (user.address.lineOne) filledFields++;
        if (user.address.lineTwo) filledFields++;
        if (user.address.district) filledFields++;
        if (user.address.subDistrict) filledFields++;
        if (user.address.state) filledFields++;
        if (user.address.postalCode) filledFields++;
        if (user.address.country) filledFields++;
        if (user.address.village) filledFields++;

        return (filledFields / totalFields) * 100; // Return percentage
    };

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const completionPercentage = calculateProfileCompletion(user);

        // Only update the completeProfile field if the profile is now complete and it hasn't been marked as such before
        if (completionPercentage === 100 && !user.isProfileComplete) {
            user.isProfileComplete = true;
            await user.save();  // Only saves when profile becomes fully complete for the first time
        }

        res.json({ isProfileComplete: user.isProfileComplete, completionPercentage });
    } catch (error) {
        console.error('Error calculating profile completion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getLocation = async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        const data = await response.json();
        const location = data.display_name;
        res.json({ location });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch location name." });
    }
};

export const getLatLonFromAddress = async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: "Address is required." });
    }

    try {
        // Make the API request to OpenStreetMap Nominatim API using fetch
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
        );

        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            res.json({ latitude: lat, longitude: lon });
        } else {
            res.status(404).json({ error: "Location not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get coordinates." });
    }
};

export const getLocationSuggestions = async (req, res) => {
    const query = req.query.q;  // User's search query (e.g., city, area)

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=IN&addressdetails=1&limit=5`;  // Limit results to 5 suggestions
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Return a list of location suggestions
        const suggestions = data.map(location => ({
            address: location.display_name,
            latitude: location.lat,
            longitude: location.lon,
        }));

        res.json(suggestions);  // Send suggestions to frontend
    } catch (err) {
        console.error('Error during API call:', err.message);
        res.status(500).json({ error: 'Failed to fetch location suggestions' });
    }
}