// controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Signup
export const signup = async (req, res) => {
  try {
   
    const { username, email, password } = req.body;
    const user = await User.createUser({ username, email, password });
 console.log("calling")
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({ status: 'success', user: { id: user.id, username, email }, token });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ status: 'success', user: { id: user.id, username: user.username, email }, token });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
