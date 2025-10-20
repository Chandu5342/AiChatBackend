import express from 'express';
import { createNotificationAPI, getNotifications } from '../controllers/notificationController.js';
import { sendNotification } from '../server.js';
const router = express.Router();
router.post('/', createNotificationAPI);
router.get('/:user_id', getNotifications);
router.post("/test", async (req, res) => {
  try {
    const { user_id, organization_id, message } = req.body;
    const notification = await sendNotification({ user_id, organization_id, message });
    res.json({ status: "success", notification });
  } catch (err) {
    console.error("Notification test failed:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
