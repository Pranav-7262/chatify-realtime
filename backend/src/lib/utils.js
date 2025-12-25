import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  // here userI is user id,
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // set token in httpOnly cookie
  res.cookie("jwt", token, {
    // jwt is name of cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, //
    sameSite: "strict", //it means that cookie will be sent only for same site requests
    secure: process.env.NODE_ENV !== "development", // in production , cookie will be sent only over https
  });

  return token;
};
