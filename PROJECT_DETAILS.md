# Esports Team Management & Strategy SaaS - Project Overview

## 🚀 Project Summary
A comprehensive, full-stack web application designed for professional Esports organizations to manage teams, analyze performance, and plan in-game strategies. The platform combines a robust Admin Dashboard/CRM with an advanced, interactive Map Strategy tool and performance analytics.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Glassmorphism design system), Framer Motion (Animations)
- **Maps & Visualization**: Leaflet.js (Map rendering), Konva.js (Canvas drawing), React-Leaflet
- **Analytics**: Recharts (Data visualization), Lucide React (Icons)
- **State Management**: React Hooks (Context API for Auth)

### Backend (API & Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens), Role-Based Access Control (RBAC) via middleware
- **Security**: Bcrypt (Password hashing), CORS protection

### Advanced Integrations & Special Features
- **WhatsApp Integration**: Automated event scheduling and broadcast messaging services (likely via `whatsapp-web.js` or generic API).
- **Image Processing**: `html-to-image` for high-resolution export of strategy maps.
- **AI/ML Pipeline**: Built-in data labeling interface for training YOLOv8 models (Computer Vision) to detect teams on minimap videos.
- **Cloud Storage**: Cloudinary (for team logos and avatar hosting).

---

## ✨ Key Features

### 1. Interactive Strategy Studio
A "Google Docs for Game Strategy" feature allowing coaches/IGLs to:
- **High-Fidelity Maps**: Interactive, zoomable maps (Erangel, Miramar, etc.) with tiled rendering.
- **Drawing Tools**: Draw flight paths, spawn zones, rotations, and danger areas using vector shapes (Polygons, Circles, Lines).
- **Export Engine**: One-click generation of high-resolution (8K ready) PNGs of strategies for sharing.
- **Save/Load System**: Persist strategies to the database for future review.

### 2. Admin Command Center (CRM)
- **Team Management**: Create and manage professional teams, assigning players and roles (IGL, Fragger, etc.).
- **Event Scheduling**: Calendar system to assign scrims/tournaments to teams with automated WhatsApp notifications.
- **Roster Management**: Dynamic roster handling.
- **Broadcast System**: Send bulk announcements to all team captains instantly.

### 3. Analytics & Performance Tracking
- **Performance Dashboard**: Visual charts tracking kills, placement points, and earnings over time.
- **Social Media Stats**: Track team growth across platforms (Instagram, Discord, Twitter, etc.) with "Upload Stats" functionality.
- **Video Analysis**: Tools for reviewing gameplay footage (VOD review integration).

### 4. Security & Access Control
- **Role-Based Login**: Distinct portals for **System Admins** (Full control) and **Teams** (Read-only/Limited write access).
- **Secure Auth**: Token-based session management.

---

## ⚙️ How It Works (Workflow Example)

1.  **Onboarding**: An Admin creates a new "Team" entity, uploads their logo, and generates credentials.
2.  **Notification**: The system automatically sends a WhatsApp welcome message to the team manager.
3.  **Strategy Planning**: The Team logs in, enters the "Strategy Hub", selects "Erangel", and draws their customized drop rotation plan. They download the plan as an image to share in their Discord.
4.  **Performance Review**: After the match, the Admin uploads the kill/placement data. The dashboard updates instantly, rendering trend lines showing the team's improvement over the last 30 days.

---

## 🏆 Why This Project Stands Out?
- **Complex UI/UX**: Solves the challenge of rendering heavy map data seamlessly in the browser without lag (solved via tiled rendering & logical component separation).
- **Real-World Automation**: Solves the manual pain of notifying teams about schedules by integrating direct WhatsApp messaging.
- **Future-Ready**: Includes infrastructure for AI Video Analysis, positioning the platform as a cutting-edge "Tech-first" esports solution.
