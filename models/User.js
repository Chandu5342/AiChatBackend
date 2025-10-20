import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  credits: { type: DataTypes.INTEGER, defaultValue: 10 },
  active_org_id: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'users', timestamps: false });

// Create user with hashed password
User.createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ username, email, password: hashedPassword });
};

// Deduct credits
User.deductCredits = async (user_id, amount) => {
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');
  if (user.credits < amount) throw new Error('Insufficient credits');
  user.credits -= amount;
  await user.save();
  return user.credits;
};

// Add credits (optional)
User.addCredits = async (user_id, amount) => {
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');
  user.credits += amount;
  await user.save();
  return user.credits;
};

export default User;
