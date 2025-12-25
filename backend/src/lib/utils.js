import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  // here userI is user id,
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // set token in httpOnly cookie
  // Determine SameSite behavior based on whether frontend and backend are different origins
  const isProd = process.env.NODE_ENV === "production";
  const FRONTEND_URL = process.env.FRONTEND_URL || null;
  const BACKEND_URL =
    process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  // default to 'lax' for same-origin deployments, switch to 'none' only when FRONTEND_URL differs from BACKEND_URL
  const sameSite =
    isProd && FRONTEND_URL && FRONTEND_URL !== BACKEND_URL ? "none" : "lax";

  res.cookie("jwt", token, {
    // jwt is name of cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite,
    secure: isProd, // in production, cookie will be sent only over https
    // consider setting domain when using subdomains
  });

  return token;
};
