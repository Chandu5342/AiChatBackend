import express from 'express';
import { googleLogin } from '../controllers/googleAuthController.js';

const router = express.Router();

// POST /api/google-login
router.post('/', googleLogin);

export default router;
