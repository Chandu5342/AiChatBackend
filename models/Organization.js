import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'organizations', timestamps: false });

Organization.createOrg = async ({ name, created_by }) => Organization.create({ name, created_by });
Organization.renameOrg = async (org_id, name) => {
  const org = await Organization.findByPk(org_id);
  if (!org) throw new Error('Organization not found');
  org.name = name;
  await org.save();
  return org;
};

Organization.getOrgbyId=async(org_id)=>{
  const org=await Organization.findByPk(org_id)
  return org.name;
}
export default Organization;
