import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Organization from '../models/Organization.js';
import Membership from '../models/Membership.js';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const user = await User.createUser({ username, email, password });

    const org = await Organization.createOrg({ name: `${username}'s Org`, created_by: user.id });


    await Membership.addMember({ user_id: user.id, organization_id: org.id, role: 'admin' });

    user.active_org_id = org.id;
    await user.save();


    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 6️⃣ Return user + active org
    res.status(201).json({ status: 'success', user, activeOrg: org, token });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ status: 'success', user: { id: user.id, username: user.username, email }, token });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    res.json({ status: 'success', user });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};