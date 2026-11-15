# EventFlow - Backend API Service

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3000/apis)

EventFlow Backend is an asynchronous, RESTful web service built with **Node.js**, **Express.js**, and **PostgreSQL** via **Prisma ORM**. It powers a university-wide club management and event coordination platform, providing authentication, role-based access control (RBAC), media uploads, transactional emails, event registration with digital pass generation, mock bKash mobile payment verification, and optical QR-code attendance check-in.

---

## 📌 Table of Contents

- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Configuration & Migrations](#-database-configuration--migrations)
- [API Reference Catalog](#-api-reference-catalog)
- [Interactive API Documentation (Swagger)](#-interactive-api-documentation-swagger)
- [Security & Access Control (RBAC)](#-security--access-control-rbac)
- [Authors & License](#-authors--license)

---

## 🚀 Core Features

- **Session-Based Authentication & RBAC:** Powered by `Passport.js` with `LocalStrategy`, bcrypt password hashing, and cookie-based HTTP-only session serialization.
- **Three Distinct User Roles:**
  - `STUDENT`: Profile management, campus event discovery, event registration, pass generation, attendance history.
  - `ADMIN` (Club Moderator): Assigned to a specific club, event creation (draft status), event lifecycle updates, live attendee check-in scanner.
  - `SUPER_ADMIN`: Club creation, moderator assignment with automated email notification, event approval (`DRAFT` $\rightarrow$ `PUBLISHED`), platform-wide analytics and auditing.
- **Event Lifecycle Governance:** Clubs draft events; Super Admins review and publish them. Filtering supports `All Events` and `Free Events`.
- **Payment & Digital Pass Issuance:** Mock 3-step bKash checkout simulation (`/events/verify-payment`), compound unique database constraints preventing duplicate registrations, and unique ticket ID issuance.
- **Attendance & ISO/IEC 18004 QR Check-in:** Real-time attendance verification (`/attendance/mark`), duplicate attendance detection, and scanner integration.
- **Media CDN Pipelines:** Cloudinary integration with `multer-storage-cloudinary` for event banners and club logos.
- **Transactional SMTP Email:** Automated notification dispatch via `Nodemailer` for user signup confirmations and moderator appointments.

---

## 🏗 System Architecture

The backend follows a clean **Controller-Router-Service-Prisma** modular architecture:

```
[ Client Requests (SPA / Mobile) ]
             │
             ▼
   [ Express Pipeline ]  --> (CORS, JSON Parser, express-session, Passport.js, Morgan)
             │
    ┌────────┴────────┬───────────────────┬──────────────────┐
    ▼                 ▼                   ▼                  ▼
/auth              /students            /clubs            /events & /attendance
(auth.router.js)   (student.router.js)  (super_admin.js)  (admin, events, registration, attendance)
    │                 │                   │                  │
    ▼                 ▼                   ▼                  ▼
 Controllers       Controllers         Controllers        Controllers
    │                 │                   │                  │
    └────────┬────────┴───────────────────┴──────────────────┘
             ▼
    [ Prisma ORM Client ]
             │
             ▼
[ PostgreSQL Relational Database ]
```

---

## 🛠 Tech Stack & Dependencies

| Category | Package | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | `>= 18.0.0` | JavaScript server runtime environment |
| **Framework** | Express.js | `^5.2.1` | REST API framework and middleware engine |
| **Database ORM** | Prisma | `^7.10.0` | Type-safe query builder and database migration toolkit |
| **Database Adapter** | `@prisma/adapter-pg` | `^7.10.0` | High-performance PostgreSQL connection pool adapter |
| **Authentication** | Passport & Passport-Local | `^0.7.0` | Email/password session-based authentication |
| **Password Hashing** | Bcrypt | `^6.0.0` | Cryptographic salted password hashing |
| **Session Engine** | express-session | `^1.19.0` | Secure session state with HTTP-only cookie serialization |
| **File Storage** | Multer & Cloudinary | `^2.4.0` / `^1.41.3` | Direct multipart form-data image streaming to Cloudinary |
| **Email Service** | Nodemailer | `^10.0.15` | SMTP email dispatcher for transactional notices |
| **Documentation** | Swagger UI Express & JSDoc | `^5.0.1` / `^6.3.0` | Interactive OpenAPI 3.0 UI at `/apis` |

---

## 📂 Project Structure

```text
Backend/
├── config/                     # Configuration modules
│   ├── database.config.js      # Database environment helpers
│   ├── mail.config.js          # Nodemailer SMTP transporter
│   ├── passport.config.js      # Passport LocalStrategy & serialization logic
│   └── swagger.config.js       # OpenAPI/Swagger configuration
├── controller/                 # Business logic and request handlers
│   ├── admin/                  # Club moderator event operations
│   │   └── admin.controller.js
│   ├── attendance/             # QR check-in & attendance verification
│   │   └── attendance.controller.js
│   ├── events/                 # Public event categorization filters
│   │   └── events.controller.js
│   ├── regsitration/           # Event registration & payment verification
│   │   └── registration.controller.js
│   ├── student/                # Authentication & student profile handlers
│   │   ├── auth.controller.js
│   │   └── student.controller.js
│   └── super_admin/            # Club governance & university administration
│       └── super_admin.controller.js
├── entities/                   # Schema entity definitions
├── helpers/                    # HTML email layout templates
│   └── mail/
│       ├── adminAppointment.mail.js
│       └── signup.mail.js
├── prisma/                     # Database schema definition
│   └── schema.prisma           # Prisma models, enums & relations
├── router/                     # Express route declarations
│   ├── admin/admin.router.js
│   ├── attendance/attendance.router.js
│   ├── events/events.router.js
│   ├── registration/registration.router.js
│   ├── student/
│   │   ├── auth.router.js
│   │   └── student.router.js
│   └── super_admin/super_admin.router.js
├── swagger/                    # Swagger spec generators
├── utils/                      # Utilities (Cloudinary upload configuration)
│   └── cloudinary.utils.js
├── views/                      # Template views
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules for sensitive files & logs
├── app.js                      # Express application setup & middleware assembly
├── index.js                    # HTTP server bootstrap entrypoint
├── package.json                # Project dependencies and npm scripts
└── README.md                   # This documentation file
```

---

## 📋 Prerequisites

Before running the backend, make sure you have installed:
- [Node.js](https://nodejs.org/) (Version `>= 18.0.0`)
- [npm](https://www.npmjs.com/) (Version `>= 9.0.0`)
- [PostgreSQL](https://www.postgresql.org/) (Version `>= 14.0`) running locally or hosted on Cloud (Neon, Supabase, Render, etc.)
- A [Cloudinary](https://cloudinary.com/) account for image uploads (free tier works)
- An SMTP email account (e.g., Gmail App Password) for email notifications

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/eventflow-backend.git
cd eventflow-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL and credentials in `.env` (see details below).

### 4. Setup Database with Prisma
Run Prisma to push the schema into your PostgreSQL database and generate the Prisma Client:
```bash
# Push schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 5. Start the server
```bash
# Development mode (with auto-restart via nodemon)
npm start

# Or directly with Node
node index.js
```
The server will start on `http://localhost:3000` (or the port defined in `.env`).

---

## 🔐 Environment Variables

Create a `.env` file in the root of the backend folder with the following variables:

```env
# Server Port
PORT=3000

# PostgreSQL Connection String (Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public)
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/event_flow?schema=public"

# SMTP Mail Dispatcher (Gmail App Password)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"

# Cloudinary CDN Configuration
CLOUD_NAME="your-cloud-name"
CLOUD_API_KEY="your-api-key"
CLOUD_API_SECRET="your-api-secret"
```

---

## 🗄 Database Configuration & Migrations

The database models are maintained in [`prisma/schema.prisma`](prisma/schema.prisma):

- **`User`**: Accounts with roles (`STUDENT`, `ADMIN`), emails, student IDs, and department details.
- **`StudentPreference`**: 1-to-1 extension storing student hobbies, interests, and graduation year.
- **`Club`**: Registered university clubs with moderator email, description, and profile logo.
- **`Event`**: Events hosted by clubs with banner, venue, schedule, fee, tags, category, and approval status (`DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED`).
- **`Registration`**: Compound unique enrollment records (`[userId, eventId]`) with unique ticket codes.
- **`Payment`**: Financial records tracking payment method (`BKASH`, `FREE`) and transaction ID.
- **`Attendance`**: Verified check-ins with compound constraint (`[eventId, userId]`) and scanning timestamp.

Useful Prisma commands:
```bash
# Inspect and modify database via web UI
npx prisma studio

# Validate schema syntax
npx prisma validate

# Format schema file
npx prisma format
```

---

## 📡 API Reference Catalog

### 1. Authentication (`/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticate user via Passport LocalStrategy; sets session cookie | Public |
| `GET` | `/auth/user` | Retrieve authenticated user session profile & role | Authenticated |
| `POST` | `/auth/logout` | Destroy active session and clear session cookie | Authenticated |

### 2. Student & Preferences (`/students`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/students/signup` | Student registration with automatic confirmation email | Public |
| `GET` | `/students/profile` | Retrieve student profile including hobbies and interests | Student |
| `PUT` | `/students/profile` | Update profile information, preferences, and tags | Student |

### 3. Club Governance (`/clubs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/clubs/create` | Create a club, assign moderator, upload logo, send appointment email | Super Admin |
| `GET` | `/clubs/all` | List all registered university clubs | Public / Super Admin |
| `GET` | `/clubs/details` | Fetch specific club information (`?id=...`) | Public |
| `PUT` | `/clubs/update` | Update club title, description, or assigned moderator | Super Admin |
| `DELETE`| `/clubs/delete` | Delete club and cascade remove associated events | Super Admin |
| `GET` | `/clubs/students`| Retrieve all registered students across the university | Super Admin |
| `GET` | `/clubs/admins` | Retrieve list of club moderators and assigned clubs | Super Admin |

### 4. Events & Publishing (`/events`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/events/create-event` | Create an event under the moderator's club with banner upload | Admin (Club) |
| `PUT` | `/events/update-event` | Update event information (allowed when not published) | Admin / Super Admin |
| `GET` | `/events/all-events` | Fetch all published events | Public |
| `GET` | `/events/free-events`| Fetch only free published events (`registrationFee = 0`) | Public |
| `GET` | `/events/club-events`| Fetch events hosted by a specific club (`?clubId=...`) | Public |
| `GET` | `/events/event-details`| Get comprehensive details of a single event (`?id=...`) | Public |
| `PUT` | `/events/update-status`| Update event lifecycle (`DRAFT`, `PUBLISHED`, `COMPLETED`) | Super Admin |

### 5. Registration & Payment (`/events`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/events/event-register` | Initiate registration; returns payment pending status | Student |
| `POST` | `/events/verify-payment` | Verify simulated bKash transaction & issue confirmed ticket | Student |
| `GET` | `/events/my-registrations`| Fetch registration history & ticket status for a student | Student |

### 6. Attendance & QR Scanner (`/attendance`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/attendance/mark` | Verify ticket ID and mark attendee `PRESENT` | Admin / Scanner |
| `GET` | `/attendance/verify` | Query ticket validity and previous check-in status | Admin / Scanner |
| `GET` | `/attendance/event` | List all verified attendees for an event (`?eventId=...`) | Admin / Super Admin |

---

## 📖 Interactive API Documentation (Swagger)

EventFlow provides a comprehensive OpenAPI 3.0 specification. Once the backend server is running, navigate to:

👉 **[http://localhost:3000/apis](http://localhost:3000/apis)**

Features available in Swagger UI:
- Interactive endpoint testing ("Try it out")
- Detailed request schema models and parameter specifications
- Expected response status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `500 Server Error`)

---

## 🔒 Security & Access Control (RBAC)

1. **Authentication:** Passwords are encrypted using `bcrypt` salted rounds before database persistence.
2. **Session Security:** `express-session` cookies are configured with `httpOnly: true`, preventing client-side XSS tampering.
3. **CORS:** Cross-Origin Resource Sharing is locked down to allow frontend client origins with `credentials: true`.
4. **Data Integrity:** Compound unique constraints (`[userId, eventId]` for registrations and `[eventId, userId]` for attendance) prevent double-booking and double check-ins at the database level.

---

## 👥 Authors & License

- **Developer:** Md. Ali Haidar
- **Project:** EventFlow - University Club & Event Management System
- **License:** ISC
