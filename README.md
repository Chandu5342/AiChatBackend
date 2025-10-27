**Chat Application Backend**

This is the backend API for a real-time Chat Application that supports organization-based communication, Google authentication, AI-assisted chats (via LLM), and role-based access.

Built using Node.js, Express, PostgreSQL, and JWT authentication.
 **Features**

User Authentication

Signup & Login with JWT

Google Login integration

Organization Management

Create organizations

Rename, invite members, and set active organization

Fetch organization details and member list

Chat System

Create chat rooms

Send and retrieve messages

Organization-based chat grouping

AI Chat Integration

Send messages to LLM (Large Language Model) endpoint

Get AI-generated responses for organizational context

Notifications

Create and fetch user-specific notifications

Real-time message notification test route

Middleware

JWT authentication middleware (protect)

Membership validation middleware (isOrgMember)
---

## Folder Structure

```
backend/
│── controllers/       # Business logic for routes
│── middleware/        # Auth & membership validation
│── models/            # Sequelize models for PostgreSQL
│── routes/            # All route files
│── config/            # Database config and environment setup
│── server.js          # Entry point
│── .env               # Environment variables
```

---

## Tech Stack

* Node.js + Express
* PostgreSQL + Sequelize ORM
* JWT Authentication
* bcrypt.js for password hashing
* LLM API Integration(Gemini Api)
* dotenv for database configuration
* Google OAuth Login

## DB configuration (use phpmyadmin)
PORT=4000
NODE_ENV=development
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRES_IN=7d
DB_URL=postgresql://postgres.bdnodwywqgrntxklnhbx:.........@@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
GOOGLE_CLIENT_ID=887989750531-v7t9k9unkevd9q6lk9ng18o00i2uhtoa.apps.googleusercontent.com
GEMINI_API_KEY=kkkj



## API Endpoints

🔐 Auth Routes

| Method | Endpoint            | Description             | Access |
| ------ | ------------------- | ------------------------| ------- |
| POST   | `/api/auth/signup`  | Register a new user     | Public |
| POST   | `/api/auth/login`   | Login user, returns JWT | Public |
| GET    | `/api/auth/:id`     | Get user by ID | Protected |
| POST   | `/api/google`       | Google login authentication | Public |

---

### 🏢 Organization Routes

| Method | Endpoint                            | Description               | Access |
| ------ | ------------------------------------| ------------------------- | ------- |
| POST   | `/api/org`                          | Create a new organization | Public |
| GET    | `/api/org/:user_id`                 | Get all organizations for a user | Protected |
| PUT    | `/api/org/active`                   | Set active organization   | Protected |
| PUT    | `/api/org/rename`                   | Rename organization       | Protected |
| POST   | `/api/org/invite`                   | Invite members via email  | Protected |
| GET    | `/api/org/orgbyid/:organization_id` | Get organization details  | Protected |
| GET    | `/api/org/:organization_id/members` | Get organization members  | Protected |

---

### 💬 Chat Routes

| Method | Endpoint                      | Description                  | Access |
| ------ | ----------------------------- | ---------------------------- | ------- |
| POST   | `/api/chat`                   | Create a chat                | Protected |
| POST   | `/api/chat/message`           | Add message to chat          | Protected |
| GET    | `/api/chat/:chat_id/messages` | Get messages of a chat       | Protected |
| GET    | `/api/chat/org/:organization_id` | Get all organization chats | Protected |
| POST   | `/api/chat/send`              | Send message to LLM and get AI response | Protected |

---

### 🔔 Notification Routes

| Method | Endpoint                   | Description              | Access |
| ------ | -------------------------- | ------------------------ | ------- |
| POST   | `/api/notifications`       | Create new notification  | Protected |
| GET    | `/api/notifications/:user_id` | Get notifications for a user | Protected |
| POST   | `/api/notifications/test`  | Test notification trigger | Protected |

---

## Live Backend
  Diployed on render platform
*  [Chat Application API](https://chat-application-backend.onrender.com)
---

## Test Accounts

| Role | Email | Password |
| ---- | ------ | -------- |
| User | chandu@gmail.com | 123456 |

---

## Run Locally

```bash
git clone https://github.com/Chandu5342/ChatApplicationBackend.git
cd ChatApplicationBackend
npm install
npm run dev
``

Server will run on: `http://localhost:5000`
