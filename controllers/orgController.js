// controllers/orgController.js
import Organization from '../models/Organization.js';
import Membership from '../models/Membership.js';

// Create new organization
export const createOrganization = async (req, res) => {
  try {
    const { name, user_id } = req.body;

    // 1. Create org
    const org = await Organization.createOrg({ name, created_by: user_id });

    // 2. Add creator as Admin in Membership
    await Membership.addMember({ user_id, organization_id: org.id, role: 'admin' });

    res.status(201).json({ status: 'success', org });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Get all organizations for a user
export const getUserOrgs = async (req, res) => {
  try {
    const { user_id } = req.params;

    const memberships = await Membership.findAll({ where: { user_id } });

    res.json({ status: 'success', memberships });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
export const setActiveOrg = async (req, res) => {
  try {
    const { user_id, organization_id } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    user.active_org_id = organization_id;
    await user.save();

    res.json({ status: 'success', message: 'Active organization updated' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};