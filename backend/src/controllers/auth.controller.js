import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10); //10 means 2^10 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate token JWT
      generateToken(newUser._id, res); // set token in cookie
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // Log full error (stack) for easier debugging
    console.error("Signup controller error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res); // set token in cookie
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const logout = async (req, res) => {
  try {
    // Clear cookie with same attributes used for setting it
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout controller error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body; // Get both from body
    const userId = req.user._id;

    // Create an object to store fields we want to update
    const updateData = {};

    // 1. If fullName is provided, add it to update object
    if (fullName) {
      if (fullName.trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Full name must be at least 3 characters" });
      }
      updateData.fullName = fullName;
    }

    // 2. If profilePic is provided, upload to Cloudinary and add to update object
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    // 3. Check if there's actually anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData, // Pass the dynamic update object
      { new: true }
    );

    res.status(200).json(updatedUser); // Return the updated document directly
  } catch (error) {
    console.error("Update Profile controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("checkAuth controller error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
