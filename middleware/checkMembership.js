import Membership from '../models/Membership.js';

export const isOrgMember = async (req, res, next) => {
   // console.log("call bef")
  try {
    const user_id = req.user.id; // get user from token (protect middleware)
    console.log(req.params.organization_id)
    const org_id =  req.params.organization_id || req.body.organization_id ;
     
    if (!org_id) throw new Error('organization_id required');
  
    const membership = await Membership.findOne({ where: { user_id, organization_id: org_id } });
    if (!membership) return res.status(403).json({ status: 'error', message: 'Access denied' });
      console.log("call cont",org_id)

    next();
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
