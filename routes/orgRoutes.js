import express from 'express';
import { createOrganization, getUserOrgs, setActiveOrg, renameOrganization, inviteMember, getOrganizationById } from '../controllers/orgController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/', createOrganization);
router.get('/:user_id', getUserOrgs);
router.put('/active', setActiveOrg);
router.put('/rename', renameOrganization);
router.post('/invite', inviteMember);
router.get('/orgbyid/:organization_id',getOrganizationById);
router.get('/:organization_id/members', protect, async (req, res) => {
  try {
    const { organization_id } = req.params;
    const members = await Membership.findAll({ where: { organization_id } });
    res.json({ status: 'success', members });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});
export default router;
