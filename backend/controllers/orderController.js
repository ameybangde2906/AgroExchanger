// controllers/orderController.js
import Order from '../models/Order.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new order
export const createOrder = async (req, res) => {
  const {
    category,
    productName,
    productType,
    speciality,
    address, // This should include state, district, sub-district, village
    price,
    allowedPriceEntry,
    pickUpDate,
    quantity,
    quantityUnit,
    productImage,
  } = req.body;

  const sellerId = req.user._id; // Ensure req.user is populated (if using authentication)

  // Helper function to get latitude and longitude from the address
  const getLatLonFromAddress = async (address) => {
    if (!address) {
      throw new Error("Address is required.");
    }

    try {
      // Fetch coordinates from OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${address.village}, ${address.subDistrict}, ${address.district},`
        )}&format=json&addressdetails=1&limit=1`
      );

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error("Location not found.");
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err.message);
      throw new Error("Failed to fetch coordinates.");
    }
  };

  try {
    // Fetch latitude and longitude for the address
    const { latitude, longitude } = await getLatLonFromAddress(address);

    // Upload images to Cloudinary
    let imgUrls = [];
    if (productImage && Array.isArray(productImage)) {
      const uploadPromises = productImage.map(async (image) => {
        const uploadedResponse = await cloudinary.uploader.upload(image);
        return uploadedResponse.secure_url;
      });
      imgUrls = await Promise.all(uploadPromises);
    }

    // Create the order with GeoJSON location
    const order = new Order({
      category,
      productName,
      productType,
      speciality,
      quantity,
      quantityUnit,
      price,
      allowedPriceEntry,
      address: {
        lineOne: address.lineOne,
        lineTwo: address.lineTwo,
        state: address.state,
        district: address.district,
        subDistrict: address.subDistrict,
        village: address.village,
        country: "India",
        pincode: address.pincode,
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
        },
      },
      pickUpDate,
      seller: sellerId,
      productImage: imgUrls,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Mark Order as Deleted (Soft Delete)
export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const sellerId = req.user._id;

  try {
    const order = await Order.findOne({ _id: orderId, seller: sellerId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you are not authorized to delete this order' });
    }

    // Mark the order as deleted (soft delete)
    order.deleted = true;
    await order.save();

    res.status(200).json({ message: 'Order marked as deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOrders = async (req, res) => {
  try {
    const {
      cropName,        // Array of crop names
      latitude,        // Current user's latitude
      longitude,       // Current user's longitude
      maxDistance = 50000, // 50 km in meters (default)
      minPrice,
      maxPrice,
      limit = 10,      // Default limit for pagination
      page = 1,        // Default page for pagination
    } = req.query;

    // Ensure latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required for nearby search." });
    }

    // Build dynamic query object for filtering
    const query = {};

    if (cropName ) {
      query['productName'] = { $in: cropName }; // Case-insensitive match
    }

    // Add price filter
    if (minPrice || maxPrice) {
      query['price'] = {};
      if (minPrice) query['price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price'].$lte = parseFloat(maxPrice);
    }

    // Fetch orders with geospatial query for proximity
    const orders = await Order.find({
      ...query,
      'address.location': {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(maxDistance), // Max distance in meters
        },
      },
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate({
        path: "seller",
        select: "-password", // Exclude sensitive seller data
      });

    // Send response with pagination info
    
    res.json({
      orders,
      totalOrders: orders.length,
      totalPages: Math.ceil(orders.length / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders. Please try again." });
  }
};



// Fetch orders by seller
export const getOrdersBySeller = async (req, res) => {
  const sellerId = req.user._id;

  try {
    // Assuming each order has a 'seller' field that references the seller's ID
    const orders = await Order.find({ seller: sellerId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchSuggestion = async (req, res) => {
  const searchKey = new RegExp(req.params.key, 'i');
  try {
    let orders = await Order.find({
      "$or": [
        { productName: { $regex: searchKey } },
        { category: { $regex: searchKey } },
        { productVariety: { $regex: searchKey } },
      ]
    }).select('productName category productVariety');  // Select only the relevant fields

    // Create unique sets for productName, category, and productVariety
    const uniqueProductNames = new Set();
    const uniqueCategories = new Set();
    const uniqueProductVarieties = new Set();

    // Loop through the orders and add unique values to the sets
    orders.forEach(order => {
      if (order.productName) uniqueProductNames.add(order.productName);
      if (order.category) uniqueCategories.add(order.category);
      if (order.productVariety) uniqueProductVarieties.add(order.productVariety);
    });

    // Prepare the result with unique values
    const uniqueResults = {
      productNames: Array.from(uniqueProductNames),
      categories: Array.from(uniqueCategories),
      productVarieties: Array.from(uniqueProductVarieties)
    };

    res.status(200).json(uniqueResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUniqueProductNamesByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    const productNames = await Order.distinct('productName', { category });

    if (productNames.length === 0) {
      return res.status(404).json({ message: 'No products found for the given category' });
    }

    res.status(200).json({ productNames });
  } catch (error) {
    console.error('Error fetching unique product names:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Order.findById(req.params.id)
      .populate({
        path: "seller",
        select: "-password",
      })
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getPlaylistById controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
