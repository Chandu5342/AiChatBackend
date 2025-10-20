import { sendNotification } from './server.js';

await sendNotification({
  user_id: "USER_ID_HERE",
  organization_id: "ORG_ID_HERE",
  message: "🎉 Test real-time notification!"
});
