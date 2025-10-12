// routes/orgRoutes.js
import express from 'express';
import { createOrganization, getUserOrgs } from '../controllers/orgController.js';

const router = express.Router();

// POST /api/orgs → create new org
router.post('/', createOrganization);

// GET /api/orgs/:user_id → get all orgs for a user
router.get('/:user_id', getUserOrgs);

export default router;
