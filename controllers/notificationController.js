import Notification from '../models/Notification.js';
import { sendNotification } from '../server.js';

export const createNotificationAPI = async (req, res) => {
  try {
    const { user_id, organization_id, message } = req.body;
    const notification = await sendNotification({ user_id, organization_id, message });
    res.status(201).json({ status: 'success', notification });
  } catch (err) { res.status(400).json({ status: 'error', message: err.message }); }
};

export const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.findAll({ where: { user_id }, order: [['id', 'ASC']] });
    res.json({ status: 'success', notifications });
  } catch (err) { res.status(400).json({ status: 'error', message: err.message }); }
};
