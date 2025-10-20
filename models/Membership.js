import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Membership = sequelize.define('Membership', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  organization_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'member' }
}, { tableName: 'memberships', timestamps: false });

Membership.addMember = async ({ user_id, organization_id, role }) => Membership.create({ user_id, organization_id, role });
Membership.getUserMemberships = async (user_id) => Membership.findAll({ where: { user_id } });

export default Membership;
