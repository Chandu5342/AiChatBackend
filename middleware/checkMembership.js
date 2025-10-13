import Membership from '../models/Membership.js';

// Checks if user belongs to org
export const isOrgMember = async (req, res, next) => {
  try {
    const user_id = req.body.user_id || req.params.user_id;
    const org_id = req.body.organization_id || req.params.organization_id;

    if (!user_id || !org_id) throw new Error('user_id and organization_id required');

    const membership = await Membership.findOne({ where: { user_id, organization_id: org_id } });
    if (!membership) return res.status(403).json({ status: 'error', message: 'Access denied: not a member of this org' });

    next();
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
