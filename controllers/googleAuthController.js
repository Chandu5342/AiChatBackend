import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.createUser({ username: name, email, password: Math.random().toString(36).slice(-8) });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ status: 'success', user: { id: user.id, username: user.username, email }, token });
  } catch (err) { res.status(400).json({ status: 'error', message: err.message }); }
};
