import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // get token from cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // here we are decoding the token with the same secret key

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // exclude password field, ans setting req.user

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // setting user in req object

    next();
  } catch (error) {
    // Use console.error for actual errors and avoid verbose debug logging
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
