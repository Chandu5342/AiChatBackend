import Notification from '../models/Notification.js';
import { sendNotification } from '../server.js';

// POST /api/notifications
export const createNotificationAPI = async (req, res) => {
  try {
    console.log("Received POST /api/notifications", req.body);
    const { user_id, organization_id, message } = req.body;
    if (!user_id || !message) {
      return res.status(400).json({ status: 'error', message: 'user_id and message are required' });
    }
    const notification = await sendNotification({ user_id, organization_id, message });
    res.status(201).json({ status: 'success', notification });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// GET /api/notifications/:user_id
export const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.findAll({ where: { user_id }, order: [['id', 'ASC']] });
    res.json({ status: 'success', notifications });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};
