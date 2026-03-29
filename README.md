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

| 📸 Reporting | 🤖 AI Analysis | 🗺️ Live Map |
| :--- | :--- | :--- |
| Quick submission with GPS & reverse geocoding | Gemini AI classifies waste from photos instantly | Interactive hotspot mapping & recycling centers |

| 🎨 OLED UI | 🔐 Secure Auth | 🌱 Awareness |
| :--- | :--- | :--- |
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

## 📂 Project Structure

```text
📦 AI-Powered-Smart-Waste-Mapping-Platform/
├── 📁 backend/                    # Express.js API Server
│   ├── 📄 server.js               # Entry point (Express app & API logic)
│   ├── 📄 db.js                   # Supabase Client Initialization
│   └── 📄 .env                    # Secure Keys
│
├── 📁 frontend/                   # Vanilla Client App
│   ├── 📄 index.html              # Login & Register Authentication Shell
│   ├── 📄 app.html                # Main App Shell & Home View
│   ├── 📄 admin.html              # Overview Dashboard
│   ├── 📄 map.html                # Live interactive Map
│   ├── 📄 report.html             # Waste Reporting System
│   ├── 📄 awareness.html          # Education & Leaderboard
│   ├── 📄 router.js               # Client-side SPA routing logic
│   ├── 📄 style.css               # Global Styling System
│   └── 📄 ui-utils.js             # Toast & Modal Helpers
│
├── 📄 run-app.js                  # Unified startup script for DEV (Ports 3000 & 8080)
└── 📄 README.md
```

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

From the root directory, launch the unified runner:

```powershell
node run-app.js
```

- **Unified App:** `http://localhost:8080/`
- **Backend API:** `http://localhost:3000/`

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
| `GET`  | `/leaderboard`       | -                                                                              | Reaps top 10 users by impact score                  |

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
