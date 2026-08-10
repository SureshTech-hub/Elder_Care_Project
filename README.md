<div align="center">

<img src="https://img.shields.io/badge/Elder%20Care-Predictive%20OS-6366f1?style=for-the-badge&logo=heart&logoColor=white" alt="Elder Care" />

# 🏥 Elder Care — Predictive Operations System

**A comprehensive, AI-powered elder care facility management platform built for the modern healthcare workforce.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](LICENSE)

[🚀 Live Demo](#) · [📖 Documentation](#features) · [🐛 Report Bug](https://github.com/SureshTech-hub/Elder_Care_Project/issues) · [💡 Request Feature](https://github.com/SureshTech-hub/Elder_Care_Project/issues)

---

</div>

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [API Overview](#-api-overview)
- [Demo Credentials](#-demo-credentials)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏗 About the Project

**Elder Care Predictive OS** is a full-stack operational intelligence platform designed for elder care facilities. It streamlines day-to-day operations — from caregiver shift management and resident health tracking to AI-powered risk prediction and medication administration.

The platform offers a **Command Center dashboard** for facility managers, caregivers, and analysts to monitor resident wellbeing, respond to critical alerts, and generate predictive risk assessments powered by **Google Gemini AI**.

> ⚠️ **Disclaimer**: This system provides operational decision support and trend indicators. It is not a medical diagnosis tool and does not replace professional clinical evaluation.

---

## ✨ Key Features

| Module | Description |
|---|---|
| 🏠 **Resident Directory** | Full resident profiles with medical history, emergency contacts, and room assignments |
| 📋 **Care Plans** | Structured care plans with goals, interventions, and priority management |
| 💊 **Medication Administration** | Prescription tracking, dosage schedules, and route management |
| 🎯 **Activities** | Scheduling and tracking therapeutic and recreational activities |
| ✅ **Task Management** | Caregiver task assignments with priority and due-date tracking |
| ⚠️ **Incident Reporting** | Log, investigate, and resolve clinical incidents with severity triage |
| 🗓️ **Shift Scheduling** | Caregiver shift planning with resident assignment and status tracking |
| 🔔 **Alerts & Notifications** | Real-time operational alerts with acknowledgement workflows |
| 📈 **Predictive Risk** | AI-assisted fall risk, health deterioration, and hospitalization probability scores |
| 🤖 **AI Review** | Google Gemini-powered narrative review generation for resident conditions |
| 📊 **Reports & Audit Logs** | Facility operational summaries and full audit trail |
| 🌗 **Dark / Light Mode** | Fully themed interface with smooth toggle |
| 🔐 **Role-Based Access** | Admin, Manager, Analyst, and Staff roles with permission scoping |

---

## 🛠 Tech Stack

### Frontend
- **[React 19](https://react.dev)** — Modern UI component framework
- **[TypeScript 6](https://www.typescriptlang.org)** — Statically typed JavaScript
- **[Vite 8](https://vitejs.dev)** — Lightning-fast build tooling
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first CSS framework
- **[React Router v7](https://reactrouter.com)** — Client-side routing
- **[React Hook Form](https://react-hook-form.com)** — Performant form management
- **[Recharts](https://recharts.org)** — Composable dashboard charts
- **[Lucide React](https://lucide.dev)** — Icon library
- **[React Hot Toast](https://react-hot-toast.com)** — Notification toasts

### Backend
- **[Node.js](https://nodejs.org) + [Express 5](https://expressjs.com)** — RESTful API server
- **[MongoDB](https://mongodb.com) + [Mongoose 9](https://mongoosejs.com)** — Database & ODM
- **[JWT](https://jwt.io)** — Stateless authentication
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** — Password hashing
- **[Helmet](https://helmetjs.github.io)** — Security HTTP headers
- **[Morgan](https://github.com/expressjs/morgan)** — HTTP request logging
- **[Google Gemini AI](https://ai.google.dev)** — Generative AI for clinical narratives

---

## 🏛 Architecture

```
Elder Care Predictive OS
│
├── frontend/               ← React + TypeScript + Vite SPA
│   ├── src/
│   │   ├── api/            ← Axios API layer (per-module)
│   │   ├── components/     ← Reusable UI components
│   │   ├── context/        ← React Context (Auth, Theme)
│   │   ├── layouts/        ← Dashboard layout wrapper
│   │   ├── pages/          ← Page components (per module)
│   │   └── types/          ← Shared TypeScript interfaces
│   └── index.css           ← Tailwind v4 theme configuration
│
└── backend/                ← Node.js + Express REST API
    └── src/
        ├── config/         ← DB, Gemini AI configuration
        ├── controllers/    ← Route handlers (per resource)
        ├── middleware/     ← Auth, error handling, roles
        ├── models/         ← Mongoose schemas
        ├── routes/         ← Express route definitions
        ├── seed/           ← Database seed scripts
        ├── services/       ← AI service abstraction
        ├── utils/          ← Shared utilities
        └── validators/     ← Input validation rules
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 18.x`
- **npm** `>= 9.x`
- **MongoDB Atlas** account (or local MongoDB `>= 6.x`)

### 1. Clone the Repository

```bash
git clone https://github.com/SureshTech-hub/Elder_Care_Project.git
cd Elder_Care_Project
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Copy the environment template and fill in your values:

```bash
cp ../.env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gemini API key
```

Start the development server:

```bash
npm run dev
# API server starts at http://localhost:5000
```

### 3. Seed the Database

```bash
# Step 1: Create demo users (required first)
npm run seed:demo

# Step 2: Populate all modules with realistic sample data
npm run seed:all
```

### 4. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### 5. Open the App

Navigate to [http://localhost:5173](http://localhost:5173) and log in with one of the [demo credentials](#-demo-credentials).

---

## 🔧 Environment Variables

Create a `.env` file inside the `backend/` directory based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eldercare

# JWT Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Google Gemini AI (optional — AI Review module requires this)
GEMINI_API_KEY=your_gemini_api_key

# CORS
CLIENT_URL=http://localhost:5173
```

> 🔑 Get your **Gemini API Key** free at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🌱 Database Seeding

The project ships with two seed scripts:

| Script | Command | Description |
|---|---|---|
| Demo Users | `npm run seed:demo` | Creates 4 demo users (Admin, Manager, Analyst, Staff) |
| Full Data | `npm run seed:all` | Seeds 4 residents + all related module records |

> ⚠️ Run `seed:demo` **before** `seed:all`. The full data seed requires demo users to exist.

---

## 📡 API Overview

All API endpoints are prefixed with `/api/v1/`.

| Resource | Base Route | Methods |
|---|---|---|
| Auth | `/api/v1/auth` | POST login, register, GET me |
| Users | `/api/v1/users` | CRUD |
| Residents | `/api/v1/residents` | CRUD |
| Care Plans | `/api/v1/care-plans` | CRUD |
| Medications | `/api/v1/medications` | CRUD |
| Activities | `/api/v1/activities` | CRUD |
| Tasks | `/api/v1/tasks` | CRUD |
| Incidents | `/api/v1/incidents` | CRUD |
| Shifts | `/api/v1/shifts` | CRUD |
| Alerts | `/api/v1/alerts` | CRUD + status update |
| Notifications | `/api/v1/notifications` | CRUD + mark read |
| Predictions | `/api/v1/predictions` | CRUD |
| AI Review | `/api/v1/ai` | POST generate, GET all, GET by ID |
| Audit Logs | `/api/v1/audits` | GET |
| Reports | `/api/v1/reports` | GET summary |

> 🔐 All routes (except auth) require a valid JWT Bearer token in the `Authorization` header.

---

## 🔑 Demo Credentials

After running `npm run seed:demo`, use these accounts to explore the application:

| Role | Email | Password | Access |
|---|---|---|---|
| 👑 **Admin** | `admin@eldercare.com` | `Admin@123` | Full system access |
| 📊 **Manager** | `manager@eldercare.com` | `Manager@123` | Operations & reports |
| 🔬 **Analyst** | `analyst@eldercare.com` | `Analyst@123` | Data & predictions |
| 👩‍⚕️ **Staff** | `staff@eldercare.com` | `Staff@123` | Resident care & tasks |

> 💡 The **Login page** includes a **Role Selector** that auto-fills demo credentials for quick access.

---

## 📸 Screenshots

| Dashboard | Resident Directory |
|---|---|
| ![Dashboard](https://via.placeholder.com/500x300/0f172a/6366f1?text=Dashboard) | ![Residents](https://via.placeholder.com/500x300/0f172a/6366f1?text=Residents) |

| AI Review | Predictive Risks |
|---|---|
| ![AI Review](https://via.placeholder.com/500x300/0f172a/6366f1?text=AI+Review) | ![Predictions](https://via.placeholder.com/500x300/0f172a/6366f1?text=Predictions) |

---

## 📁 Project Structure

```
Elder_Care_Project/
│
├── .env.example                ← Environment variable template
├── .gitignore
├── package.json                ← Root workspace config
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js              ← Express app configuration
│       ├── server.js           ← Server entry point
│       ├── config/
│       │   ├── database.js     ← MongoDB connection
│       │   └── gemini.js       ← Google Gemini AI client
│       ├── controllers/        ← Business logic per module
│       ├── middleware/
│       │   ├── auth.js         ← JWT authentication
│       │   └── roles.js        ← Role-based access control
│       ├── models/             ← Mongoose schemas (12 models)
│       ├── routes/             ← Express routers
│       ├── seed/
│       │   ├── demoUsers.seed.js
│       │   └── fullData.seed.js
│       └── services/
│           └── ai.service.js   ← Gemini AI abstraction
│
└── frontend/
    ├── package.json
    ├── index.css               ← Tailwind v4 theme tokens
    └── src/
        ├── api/                ← Per-module Axios API clients
        ├── components/
        │   └── ui/             ← Button, DataTable, Modal, Sidebar...
        ├── context/
        │   ├── AuthContext.tsx
        │   └── ThemeContext.tsx
        ├── layouts/
        │   └── DashboardLayout.tsx
        ├── pages/              ← One directory per module
        └── types/              ← Shared TypeScript type definitions
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'feat: Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ by **[SureshTech-hub](https://github.com/SureshTech-hub)**

⭐ **Star this repo** if you found it useful!

</div>
