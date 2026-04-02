# ♻️ AI-Powered Smart Waste Mapping Platform

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=nodedotjs) ![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-yellow?logo=javascript) ![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase) ![Gemini AI](https://img.shields.io/badge/Google_Gemini-Vision_API-blue?logo=google)

> **🌱 Proudly built for the 1M1B Green Internship Project**

AI-Powered Smart Waste Mapping Platform is a full-stack, production-ready web application designed to empower communities to track, report, and manage waste effectively. It features a seamless mobile-friendly waste reporting workflow, Google Gemini-powered waste classification, live interactive mapping, secure authentication, and a gamified reputation system — all built with a modern tech stack and designed for a premium user experience.

## 📋 Table of Contents

- [Overview](#-overview)
- [Feature Highlights](#-feature-highlights)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [User Roles & Workflows](#-user-roles--workflows)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Overview

The AI-Powered Smart Waste Mapping Platform creates a seamless bridge between concerned citizens and city administrators. Users sign up, snap a photo of a waste hotspot, and submit a report. The platform instantly runs the image through **Gemini 1.5 Flash Vision API** to classify the waste type. The report is then pinned to a global Live Map. As administrators review and resolve reports via the Overview Dashboard, reporting users are automatically awarded Impact Points, boosting their rank on the city-wide Leaderboard.

## 🚀 Feature Highlights

| 📸 Reporting                                  | 🤖 AI Analysis                                   | 🗺️ Live Map                                     |
| :-------------------------------------------- | :----------------------------------------------- | :---------------------------------------------- |
| Quick submission with GPS & reverse geocoding | Gemini AI classifies waste from photos instantly | Interactive hotspot mapping & recycling centers |

| 🎨 OLED UI                                    | 🔐 Secure Auth                             | 🌱 Awareness                             |
| :-------------------------------------------- | :----------------------------------------- | :--------------------------------------- |
| Premium black theme with glassmorphic accents | Full PostgreSQL-backed authentication flow | Education, Success Stories & Leaderboard |

## 🌐 Real Website Demonstration & Video Overview

📺 **[Watch Real Website Demo (Google Drive) →](https://drive.google.com/file/d/1_NH_B0vk864Ew9zqWy9eIx0MxLRcmT9X/view?usp=drive_link)**  
📺 **[Watch Real Website Demo (FlexClip) →](https://www.flexclip.com/share/15578373xMqAzXKOc6FjYUDF1Pr9Ctdvz5aewCxf.html)**  
📺 **[Watch Real Website Demo (ScreenApp) →](https://screenapp.io/app/v/zDsbXT1ZnQ)**

## 🔑 Real Account Credentials

To test the platform's features, you can use the following real pre-configured accounts:

**🛡️ Administrator Account** (Full access to Overview Dashboard)

- **Email:** `vijay@gmail.com`
- **Password:** `1234567890`

**👤 Citizen / User Account** (Submit Reports & Earn Impact Points)

- **Email:** `tim@gmail.com`
- **Password:** `1234567890`

- **Email:** `1m1b@gmail.com`
- **Password:** `12345678`

## ✨ Features

### 1. 📸 Interactive Waste Reporting

- **Mobile-friendly form:** Quickly submit reports with Location, GPS coordinates, and descriptions.
- **Reverse Geocoding:** Automatically converts detected GPS coordinates into human-readable street addresses via the OpenStreetMap API.
- **Photo Uploads:** Attach images of the waste directly mapped to the location.
- **Real-time Status tracking:** See your reports change from 'Pending' to 'Resolved'.

### 2. 🤖 AI-Powered Waste Classification

- **Upload an image:** Provide a photo of the waste hotspot.
- **Powered by Google Gemini 1.5 Flash:** Instantly analyzes the image to classify waste into strict categories (Plastic, Organic, Metal, E-Waste, Paper).
- **Auto-population:** Automatically fills the report category based on AI findings.

### 3. 🗺️ Intelligent Live Mapping

- **Zero-cost Integration:** Built using Leaflet.js and OpenStreetMap.
- **Interactive Layers:** Easily locate nearby Recycling Centers, Pending Hotspots, and Resolved reports.
- **OLED Dark Maps:** Utilizes CartoDB Dark Matter tiles perfect for high-contrast viewing.

### 4. 🎨 Premium OLED Interface

- **Pure Black Dark Mode:** A stunning `#000000` dark theme designed for energy efficiency and contrast.
- **Glassmorphic UI:** Custom notifications and modal overlays replacing native browser alerts.
- **Dynamic CSS:** Built with responsive Vanilla CSS variables supporting seamless Light/Dark mode toggling.

### 5. 🔐 Secure Authentication

- **Full Auth Flow:** Register, login, and protected routing.
- **Cloud Database:** Powered by Supabase PostgreSQL with `bcryptjs` for secure password hashing.
- **Protected Actions:** Only authenticated users can submit reports or view the Dashboard.

### 6. 📊 Overview Dashboard and Gamification

- **Advanced Analytics:** Chart.js visualizations tracking waste categories and resolution rates.
- **Gamification System:** Earn **50 Impact Points** for every resolved report.
- **Live Leaderboard:** Compete with top contributors city-wide.

### 7. 🌱 Community Awareness & Education

- **Waste Segregation Guide:** Practical education on Organic, Dry, and Hazardous waste management.
- **Real-World Impact:** Success stories from around the globe to inspire local action.
- **Live Leaderboard:** Visual tracking of community contributions and top environmental warriors.

## 👥 User Roles & Workflows

The platform is built with two distinct experiences tailored to community members and city officials:

### 👤 Citizen (User) Work

- **Report Waste:** Snap a photo of a waste hotspot and submit it with GPS coordinates and a description.
- **AI Assistance:** Rely on the integrated Gemini AI to automatically categorize the waste perfectly every time.
- **View the Map:** Explore the Live Map to see other community reports and locate nearby recycling centers.
- **Earn Rewards:** Gain **50 Impact Points** every time your submitted report gets cleaned up and marked as "Resolved" by an admin.
- **Track Leaderboard:** Monitor your rank on the Awareness page's global leaderboard.

### 🛡️ Administrator Work

- **Dedicated Dashboard:** Access a secure Overview Dashboard to monitor all incoming waste reports.
- **Review & Resolve:** Verify pending hotspots, schedule cleanups, and update report statuses to "Resolved" when finished.
- **Analyze Data:** Track city-wide metrics through live Chart.js visualizations showing category distributions and resolution efficiency.
- **Community Management:** Keep citizens engaged by safely updating their impact scores upon task completion.

## ⚙️ How It Works

```text
User Registers / Logs In
          │
          ▼
    Snap Photo & Map Hotspot ───────────────┐
    (Waste Report Form)                     │
          │                                 │
          ▼                                 ▼
 Gemini AI Image Analysis          Live Map Automatically Updates
    (Classification)                        │
          │                                 │
          ▼                                 ▼
 Admin Reviews via Dashboard   ──►   Report Marked "Resolved"
                                            │
                                            ▼
                                User Awarded 50 Impact Points
```

## 💻 Tech Stack

### Frontend

| Technology             | Purpose                                   |
| :--------------------- | :---------------------------------------- |
| **HTML5 & Vanilla JS** | SPA architecture and UI rendering         |
| **Vanilla CSS3**       | Custom OLED Design System & Glassmorphism |
| **Leaflet.js**         | Interactive Mapping and GeoLocation       |
| **Chart.js**           | Data Visualization (Overview Dashboard)   |
| **FontAwesome 6**      | Iconography                               |

### Backend

| Technology               | Purpose                                          |
| :----------------------- | :----------------------------------------------- |
| **Node.js (v18+)**       | Runtime Environment                              |
| **Express.js**           | Web Server & REST API                            |
| **Supabase**             | PostgreSQL Database & Data Persistence           |
| **Google Generative AI** | Gemini 1.5 Flash Vision for Waste Classification |
| **bcryptjs**             | Password Hashing & Security                      |

## 📂 Detailed File Guide

The platform is organized into a clean decoupled architecture separating the Node.js API from the Vanilla JS frontend.

### 🖥️ Backend (Node.js & Express)

| File                                                                                            | Purpose                                                                                                                             |
| :---------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **[server.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/backend/server.js)**      | The primary entry point. Initializes Express, handles CORS, serves static frontend files, and mounts modular API routes.            |
| **[db.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/backend/db.js)**              | Centralized Supabase client configuration. Uses the `service_role` key to bypass RLS for administrative backend tasks.              |
| **[auth.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/backend/routes/auth.js)**   | Manages User Authentication. Features an isolated sign-in client to prevent session pollution and ensure secure profile management. |
| **[waste.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/backend/routes/waste.js)** | Core Business Logic. Handles report submissions, integrates **Google Gemini AI** for image analysis, and manages the Leaderboard.   |

### 🎨 Frontend (Vanilla JS SPA)

| File                                                                                                  | Purpose                                                                                                          |
| :---------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **[index.html](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/index.html)**         | The landing and authentication gateway. Handles user login and registration flows.                               |
| **[app.html](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/app.html)**             | The main application shell. Hosts the dashboard and provides the interface for navigated views.                  |
| **[admin.html](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/admin.html)**         | Administrative Dashboard. Features Chart.js analytics and tools for verifying and resolving waste reports.       |
| **[map.html](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/map.html)**             | Interactive Live Map. Powered by Leaflet.js to visualize hotspots and recycling centers globally.                |
| **[report.html](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/report.html)**       | Reporting Interface. A smart form that utilizes reverse geocoding and AI classification to simplify submissions. |
| **[awareness.html](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/awareness.html)** | Community Hub. Contains educational materials, success stories, and the real-time Global Leaderboard.            |
| **[router.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/router.js)**           | SPA Engine. Manages client-side navigation and dynamic content loading without page refreshes.                   |
| **[auth-ui.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/auth-ui.js)**         | Identity Management. Handles the profile dropdown, user state persistence, and secure logout logic.              |
| **[style.css](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/style.css)**           | Design System. Definitive OLED-black theme with glassmorphic accents and responsive layout variables.            |
| **[ui-utils.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/frontend/ui-utils.js)**       | UX Helpers. Standardizes cross-app components like Toast notifications and visual feedback modals.               |

### 🛠️ Build & Utility Scripts

| File                                                                                 | Purpose                                                                                                                              |
| :----------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **[run-app.js](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/run-app.js)** | Unified development runner. Launches the Express backend (3000) and can be configured to manage frontend development servers (8080). |
| **[.env](file:///c:/1M1B/AI-Powered-Smart-Waste-Mapping-Platform/.env)**             | Critical environment configuration containing API keys and database credentials. (Not included in Git).                              |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ installed
- A [Supabase](https://supabase.com/) Project (URL and Service Key)
- A Google [Gemini API](https://aistudio.google.com/) Key

### 1. Clone the Repository

```powershell
git clone https://github.com/your-username/ai-powered-smart-waste-mapping.git
cd ai-powered-smart-waste-mapping
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Port
PORT=3000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase — PostgreSQL Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

⚠️ _Never commit your `.env` file. Ensure it is listed in `.gitignore`._

### 3. Install Dependencies & Database

```powershell
npm install
cd backend
npm install
```

_Note: Ensure to run the required SQL scripts in your Supabase SQL editor to create the `users` and `waste_reports` tables before proceeding._

### 4. Run Locally

From the root directory, launch the unified server:

```powershell
npm start
```

- **Unified Platform:** `http://localhost:3000/` (Serves both Frontend & API)

### 🛠️ Troubleshooting & Fixes

#### 🔐 Authentication & RLS Fix (New)

The platform now utilizes an **isolated Supabase Client** for user sign-in. This prevents "session pollution" in the shared backend client, ensuring that administrative privileges (`service_role`) are maintained for crucial database operations like profile creation and impact point awards even after a user logs in.

**⚠️ Note on Server Restart:**
If you encounter a "Server error" or "Profile could not be created" during login after an update, ensure you have **restarted your backend process** (`node backend/server.js`) to apply the latest security fixes.

## 📡 API Reference

### 🔐 Auth

| Method | Endpoint  | Body                            | Description                      |
| :----- | :-------- | :------------------------------ | :------------------------------- |
| `POST` | `/signup` | `{ username, email, password }` | Register a new user              |
| `POST` | `/signin` | `{ email, password }`           | Login user, returns session data |

### 📄 Reports & Gamification

| Method | Endpoint             | Body                                                                           | Description                                         |
| :----- | :------------------- | :----------------------------------------------------------------------------- | :-------------------------------------------------- |
| `GET`  | `/reports`           | -                                                                              | Get all globally mapped waste reports               |
| `POST` | `/reportWaste`       | `{ location, latitude, longitude, description, photo_url, category, user_id }` | Submit a new map hotspot                            |
| `PUT`  | `/report/:id/status` | `{ status, role: 'admin' }`                                                    | Update report status (Awards 50 points if resolved) |
| `GET`  | `/leaderboard`       | -                                                                              | Returns all community contributors ranked by impact score |

### 🤖 AI Classification

| Method | Endpoint        | Body              | Description                                       |
| :----- | :-------------- | :---------------- | :------------------------------------------------ |
| `POST` | `/analyzeWaste` | `{ imageBase64 }` | Analyze base64 image, returns best-guess Category |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/eco-feature`
3. Commit your changes: `git commit -m 'Add amazing eco feature'`
4. Push to the branch: `git push origin feature/eco-feature`
5. Open a Pull Request

---

_"Every report counts. Help us identify waste hotspots and keep our community clean. Build your legacy, one clean street at a time."_ 🌍♻️
