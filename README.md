DevPulse – Backend API

A collaborative issue tracking platform for software teams to report bugs, suggest features, and manage issue workflows. Built with Node.js, Express.js, TypeScript, PostgreSQL, JWT authentication, and role-based access control.

🚀 Live URL

Add your deployed backend URL here:

https://your-live-api-url.com
📂 GitHub Repository

Add your repository link here:

[https://github.com/yourusername/devpulse](https://devpulse-one-delta.vercel.app/)
✨ Features
🔐 Authentication System
User registration
User login
Password hashing using bcrypt
JWT token generation
Protected routes using middleware
👥 Role-Based Access Control
Contributor
Register & login
Create issues
View all issues
Maintainer
All contributor permissions
Update any issue
Delete any issue
Change issue workflow status
Access internal system metrics
🐞 Issue Management
Create issue
Get all issues
Get single issue
Update issue
Delete issue
📊 Metrics API

Maintainers can view:

Total issues
Open issues
In-progress issues
Resolved issues
🛠️ Tech Stack
Node.js
Express.js
TypeScript
PostgreSQL
Raw SQL (pool.query)
JWT
bcryptjs
cors
📁 Project Structure
src/
│
├── app.ts
├── server.ts
│
├── config/
│
├── db/
│
├── modules/
│   ├── auth/
│   ├── issue/
│   └── middleware/
│
├── utils/
│
└── interfaces/
⚙️ Environment Variables

Create a .env file in the root directory.

PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key
🗄️ Database Schema
Users Table
Field	Type
id	SERIAL PRIMARY KEY
name	VARCHAR
email	VARCHAR UNIQUE
password	VARCHAR
role	contributor / maintainer
created_at	TIMESTAMP
updated_at	TIMESTAMP
Issues Table
Field	Type
id	SERIAL PRIMARY KEY
title	VARCHAR(150)
description	TEXT
type	bug / feature_request
status	open / in_progress / resolved
reporter_id	INTEGER
created_at	TIMESTAMP
updated_at	TIMESTAMP
🔑 API Endpoints
🔐 Authentication
Signup
POST /api/auth/signup
Login
POST /api/auth/login
🐞 Issues
Create Issue
POST /api/issues
Get All Issues
GET /api/issues
Get Single Issue
GET /api/issues/:id
Update Issue
PATCH /api/issues/:id
Delete Issue
DELETE /api/issues/:id
Get Metrics
GET /api/issues/metrics
🔒 Protected Routes

Protected routes require JWT token in headers:

Authorization: YOUR_JWT_TOKEN
🚀 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/yourusername/devpulse.git
2️⃣ Install Dependencies
npm install
3️⃣ Run Development Server
npm run dev
📌 API Testing

Use:

Postman
Thunder Client
Insomnia
🌐 Deployment

Recommended platforms:

Render
Railway
Vercel

Database:

NeonDB
Supabase
ElephantSQL
👨‍💻 Author

Md Raihan Uddin

📄 License

This project is created for educational and assignment purposes.
