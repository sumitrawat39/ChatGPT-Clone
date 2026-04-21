import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; 
    } else {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id; 
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};