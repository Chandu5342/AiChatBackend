import Organization from '../models/Organization.js';
import Membership from '../models/Membership.js';
import User from '../models/User.js';

export const createOrganization = async (req, res) => {
  try {
    const { name, user_id } = req.body;
    const org = await Organization.createOrg({ name, created_by: user_id });
    await Membership.addMember({ user_id, organization_id: org.id, role: 'admin' });
    res.status(201).json({ status: 'success', org });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const getUserOrgs = async (req, res) => {
  try {
    const { user_id } = req.params;
    const memberships = await Membership.getUserMemberships(user_id);
   
    console.log(memberships)
    res.json({ status: 'success', memberships });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const setActiveOrg = async (req, res) => {
  try {
    const { user_id, organization_id } = req.body;
    console.log(user_id,organization_id)
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    user.active_org_id = organization_id;
    await user.save();
    res.json({ status: 'success', message: 'Active organization updated' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const renameOrganization = async (req, res) => {
  try {
    const { organization_id, new_name } = req.body;
    const org = await Organization.renameOrg(organization_id, new_name);
    res.json({ status: 'success', org });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { organization_id, email, role = 'member' } = req.body;
    // Here, create a user if not exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.createUser({ username: email.split('@')[0], email, password: Math.random().toString(36).slice(-8) });
    }
    await Membership.addMember({ user_id: user.id, organization_id, role });
    res.status(201).json({ status: 'success', message: `Member invited: ${email}` });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};



export const getOrganizationById = async (req, res) => {
  try {
    console.log("vasthundi")
    const { organization_id } = req.params;

    // 1️⃣ Fetch the organization
    const org = await Organization.findByPk(organization_id);
    console.log(org)
    if (!org) return res.status(404).json({ status: 'error', message: 'Organization not found' });

    // 2️⃣ Optionally, fetch members of this org
    // const memberships = await Membership.findAll({ where: { organization_id }, include: User });
    // const members = memberships.map((m) => ({
    //   id: m.user.id,
    //   name: m.user.username,
    //   email: m.user.email,
    //   role: m.role,
    // }));

    res.json({ status: 'success', org });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
