// /middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  // Expect: "Authorization: Bearer <token>"
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // You signed token with { id: user.id } in login/register
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};
