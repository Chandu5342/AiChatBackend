// models/Chat.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Chat = sequelize.define('Chat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  organization_id: { type: DataTypes.INTEGER, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, defaultValue: 'Untitled Chat' }
}, { tableName: 'chats', timestamps: false });

Chat.createChat = async ({ organization_id, created_by, title }) => {
  return Chat.create({ organization_id, created_by, title });
};

export default Chat;
