// controllers/userController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/generateToken.js';

// Register a new user (buyer/seller)
export const registerUser = async (req, res) => {
  try {

    const { name, mobileNumber, password, confirmPassword, address, userType } = req.body;

    // Ensure all required fields are present
    if (!name || !mobileNumber || !password || !confirmPassword || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Enter the same password in both field.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      mobileNumber,
      password: hashedPassword,
      address,
      userType
    });

    await newUser.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, newUser.role, res);

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      mobileNumber: newUser.mobileNumber,
      role: newUser.role,
      address: newUser.address
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in signup controller:", error.message);
  }
};


// Login a user
export const loginUser = async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, user.role, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in login controller:", error.message);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error" })
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("error in getMe controller", error.message);
    res.status(500).json({ error: "Internal server error" })
  }
}