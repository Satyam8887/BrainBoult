import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// -------------------- REGISTER CONTROLLER --------------------
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createUser({ username, email, passwordHash });

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- LOGIN CONTROLLER --------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Login Successful",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};
