// models/Organization.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'organizations', timestamps: false });

Organization.createOrg = async ({ name, created_by }) => {
  return Organization.create({ name, created_by });
};

export default Organization;
