# Real-estate-website

---

A modern, full-featured real estate web application built with Next.js and TypeScript, featuring Tailwind CSS, Ant Design components, authentication with JWT, real-time communication via WebSocket, and a flexible backend powered by Express.js and MongoDB.

## 📑 Table of Contents

---

-   [🚀 Features](#-features)
    -   [👤 Guest (Not Logged In)](#-guest-not-logged-in)
    -   [🙍‍♂️ Authenticated Users](#-authenticated-users)
    -   [🕵️ Moderator](#-moderator)
    -   [👑 Admin](#-admin)
-   [🏗️ Project Architecture](#-project-architecture)
    -   [🔧 Technology Stack](#-technology-stack)
        -   [Frontend](#frontend)
        -   [Backend](#backend)
    -   [📁 Folder Structure](#-folder-structure-analysis)
        -   [Client](#client)
        -   [Server](#server)
-   [⚙️ Getting Started](#️-getting-started)
-   [📄 License](#-license)

## 🚀 Features

---

👤 Guest (Not Logged In)

-   Register, login, forgot password & account recovery.

-   View detailed property listings with images, amenities, and map-based directions.

-   Search & filter real estate listings by location, price, type, and amenities.

-   Read real estate advice articles and legal documents.

-   Chat with an integrated chatbot for support.

-   Restricted from posting, commenting, or using advanced features.

🙍‍♂️ Authenticated Users

-   Manage personal profile information.

-   Top-up account balance and make payments for listings.

-   Save properties to a personal wishlist.

-   Receive in-app notifications.

-   Comment on real estate posts.

-   Post new listings with full details: location, price, amenities, and images.

-   Use AI-powered suggestions for post titles and descriptions.

-   Manage posted listings: edit, hide, or archive when no longer available.

🕵️ Moderator

-   Moderate posts and related content before publication.

-   Request edits for posts that do not meet platform standards.

-   Review and moderate user comments before they appear publicly.

👑 Admin

-   Manage property categories (create, update).

-   Publish real estate tips and legal articles.

-   Manage users: approve accounts, block violators, and assign roles.

-   Grant roles to users (e.g., moderator, admin).

-   Moderate posts and comments if needed.

-   View system analytics: number of users, posts, transactions, and reports.

## 🏗️ Project Architecture

---

### 🔧 Technology Stack

**Frontend**

-   Framework: Next.js 15 + React 19 + TypeScript

-   Styling: Tailwind CSS 3.4

-   Component Library: Ant Design 5 + Ant Design Patch for React 19

-   Form Handling: React Hook Form + Yup

-   State Management: Custom hooks (no Redux)

-   Authentication: JWT (stored in cookies/localStorage)

-   HTTP Client: Axios

-   Date Utilities: Day.js, date-fns

-   Realtime: Socket.IO Client

-   Map Integration: Goong Maps SDK + React Wrapper

-   Charts: Chart.js + react-chartjs-2

-   Icons: React Icons

-   Animations: Framer Motion

**Backend**

-   Runtime: Node.js

-   Framework: Express.js

-   Database: MongoDB + Mongoose (with soft delete plugin)

-   Authentication: JWT + Google OAuth 2.0 (via Passport)

-   Environment Config: dotenv

-   Realtime Communication: Socket.IO

-   Email Service: Nodemailer

-   Data Security: Bcrypt, mongo-sanitize, cookie-parser

-   Logging & Monitoring: Morgan

-   OpenAI & Google AI API Integrations

### 📁 Folder Structure Analysis

---

Path: `client\`

```
client/
├── public/             # Static assets (images, favicons)
├── src/
│   ├── api/            # API calling functions
│   ├── app/            # App Router (layouts, pages, routing)
│   ├── components/     # UI components (Ant Design/Tailwind)
│   ├── firebase/       # Firebase config & services
│   ├── schema/         # Validation & TypeScript schemas
│   ├── store/          #  Context-based state
│   └── utils/          # Utility & helper functions
├── .env                # Frontend environment variables
└── ...
```

Path: `server\`

```
server/
├── src/
│ ├── config/      # App & DB config
│ ├── controllers/ # Business logic
│ ├── middleware/  # Auth, error handlers
│ ├── models/      # Mongoose models
│ ├── routes/      # API routes
│ └── socket/      # Socket.IO events
├──index.js        # Entry point to start the Express server
├── .env           # Server environment variables
```

## ⚙️ Getting Started

### 1. Clone the repository

```
git clone https://github.com/quoctuanday/RealEstateHub.git
cd real-estate-app
```

### 2. Setup Frontend

```
cd client
npm install
# Add the following variables to your `.env` file
npm run dev
```

### 3. Setup Backend

```
cd server
npm install
# Add the following variables to your `.env` file
npm start
```

## 📄 License

This project is created by Nguyen Quoc Tuan.
