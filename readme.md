# College Aptitude Test Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-8.19.2-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.17-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
</p>

A full-stack web application designed to help **college students** practice and evaluate their logical and aptitude skills. This platform enables **admins** to create aptitude tests and **students** to attempt them online, view results, and track performance through a leaderboard.

---

## Features

### For Students

- **Sign Up & Login** — Secure authentication system with JWT and refresh tokens
- **Attempt Aptitude Tests** — Take upcoming or available tests directly from the dashboard
- **View Results** — Instantly view score and performance summary after test submission
- **Leaderboard** — Check ranking among other students based on test performance
- **Email Notifications** — Get automatic reminders via email the night before a scheduled test
- **Face Verification** — AI-powered facial recognition to prevent impersonation during tests

### For Admins

- **Create & Manage Tests** — Add, edit, or delete aptitude tests with questions, options, and correct answers
- **View Submissions** — Track all student submissions and performance reports
- **Automated Notifications** — System automatically sends email alerts to all registered students before test day
- **Contest History** — View and manage past contests and their statistics
- **User Management** — Access and manage student data

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React.js 19, Tailwind CSS 4, ShadCN UI, Motion, Recharts |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT-based Auth with Refresh Tokens, bcryptjs |
| **Email Service** | Resend, Nodemailer, EmailJS |
| **AI/ML** | MediaPipe for face detection and verification |
| **Security** | Arcjet rate limiting, express-rate-limit |
| **File Storage** | Cloudinary |
| **Task Scheduling** | BullMQ, node-cron |
| **Deployment** | Vercel (Frontend) & Render/Railway (Backend) |

---

## Project Structure

```
CDC/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   │   ├── Admin/      # Admin dashboard pages
│   │   │   └── Service/    # Service-related pages
│   │   ├── Hooks/          # Custom React hooks
│   │   ├── Store/          # Redux store configuration
│   │   ├── Layout/         # Layout components
│   │   └── lib/            # Utilities and data
│   └── public/              # Static assets
│
├── Server/                 # Express Backend
│   ├── Admin/              # Admin routes and controllers
│   ├── config/             # Database configuration
│   ├── Cron/                # Scheduled jobs
│   ├── DB/                  # MongoDB models
│   ├── Middleware/          # Express middleware
│   ├── Service/             # Business logic services
│   └── Utils/              # Utility functions
│
└── Test/                   # Test files
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud instance)
- A `.env` file with environment variables

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/college-aptitude-platform.git
cd college-aptitude-platform
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd Server
npm install

# Install frontend dependencies
cd ../Client
npm install
```

3. **Setup environment variables**

Create a `.env` file in the Server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
RESEND_API_KEY=your_resend_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ARCJET_KEY=your_arcjet_key
```

4. **Run the development servers**

```bash
# Run backend
cd Server
npm run dev

# Run frontend (in a new terminal)
cd Client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## Core Functionalities

| Feature | Description |
|---------|-------------|
| **Test Creation** | Admins can add aptitude questions and assign test dates |
| **Test Attempt** | Students can answer MCQs and submit responses |
| **Leaderboard** | Shows rankings based on performance and accuracy |
| **Email Reminder** | Sends automated reminder emails to all students one night before the test |
| **Secure Auth** | JWT + Refresh Tokens for protected routes |
| **Face Verification** | AI-powered face verification to ensure test integrity |

---

## API Endpoints (Highlights)

### Authentication
- `POST /api/v1/user/register` — User registration
- `POST /api/v1/user/login` — User login
- `POST /api/v1/user/refresh` — Refresh access token
- `POST /api/v1/user/forgot-password` — Forgot password
- `POST /api/v1/user/verify-otp` — Verify OTP

### Contests
- `GET /api/v1/contest` — Get all contests
- `POST /api/v1/contest` — Create new contest (Admin)
- `GET /api/v1/contest/:id` — Get contest details
- `POST /api/v1/contest/:id/submit` — Submit test responses

### Leaderboard
- `GET /api/v1/leaderboard` — Get leaderboard rankings

---

## Contributors

- **Subhas Mondal** — Project Lead & Full Stack Developer | Upcoming Intern at QuantumHash Corporation
- **Sumit Prasad Gupta** — Full Stack Developer
- **Pritam Mohanto** — Competitive Programmer | ICPC Regionalist

---

## License

This project is developed as part of a college project and is open for educational and non-commercial use.

---

<p align="center">Built with ❤️ by the CDC Web Team</p>
