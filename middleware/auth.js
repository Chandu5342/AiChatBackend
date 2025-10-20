import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware to verify JWT and attach user to request
 */
export const protect = async (req, res, next) => {
  let token;
 
  try {
    // 1️⃣ Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authorized, token missing' });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
   
    req.user = user; // attach full user object
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Not authorized, token invalid' });
  }
};
