import express from 'express';
import { createNotificationAPI, getNotifications } from '../controllers/notificationController.js';

const router = express.Router();

// POST /api/notifications
router.post('/', createNotificationAPI);

// GET /api/notifications/:user_id
router.get('/:user_id', getNotifications);

export default router;
