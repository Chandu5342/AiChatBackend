// models/Message.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chat_id: { type: DataTypes.INTEGER, allowNull: false },
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  content: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'messages', timestamps: false });

Message.addMessage = async ({ chat_id, sender_id, role, content }) => {
  return Message.create({ chat_id, sender_id, role, content });
};

export default Message;
