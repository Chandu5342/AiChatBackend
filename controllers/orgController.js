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
