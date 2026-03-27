# ♻️ SmartWaste Mapping Platform (Modernized)

A premium, state-of-the-art web application designed to empower communities to track, report, and manage waste effectively. Featuring AI-powered classification, interactive mapping, and a gamified reputation system.

---

## 📖 How it Works: The User Journey

The SmartWaste Platform creates a seamless bridge between concerned citizens and city administrators through a simple 4-step lifecycle:

1.  **📸 Snap & Report**: A user encounters a waste hotspot and submits a report through the mobile-friendly form.
2.  **🤖 AI Analysis**: Our integrated **Gemini AI** instantly analyzes the report image to categorize the waste (Plastic, Metal, Organic) and suggests the best disposal method.
3.  **🗺️ Live Mapping**: The report is instantly pinned to the global **Live Map**, allowing community members and authorities to visualize hotspots in real-time.
4.  **🏆 Resolution & Impact**: Administrators review reports via the **Overview Dashboard**. Once a report is marked as "Resolved," the reporting user is automatically awarded **50 Impact Points**, boosting their rank on the city-wide **Leaderboard**.

---

## ✨ Key Features

### 🏆 Gamification & Reputation System
-   **Impact Scores**: Users earn **50 points** for every waste report that is successfully resolved by an administrator.
-   **City Leaderboard**: Compete with other contributors to become the top waste-mapping hero in your city.
-   **Visual Progress**: View your rank and total impact directly on the Awareness page.

### 🌓 Pure Black OLED Interface
-   **OLED Dark Mode**: A stunning, pure black (#000000) dark theme designed for high-contrast visibility and energy efficiency on mobile devices.
-   **Custom UI Notifications**: Replaced all native browser alerts with premium, non-blocking toast notifications and glassmorphic modals.
-   **Dynamic Component Scaling**: Map tiles and Overview charts automatically adapt to maintain perfect legibility.

### 📊 Modern Overview Dashboard
-   **Renamed Lifecycle**: The "Admin" section has been evolved into a streamlined "Overview" dashboard for seamless management.
-   **Advanced Analytics**: Real-time **Chart.js** visualizations showing waste hotspots by area, report status distribution, and submission trends.
-   **Bulk Management**: Seed sample data for testing or manage live reports with high-contrast Status Badges.

### 🗺️ Intelligent Waste Mapping
-   **Leaflet.js Integration**: A completely free, independent mapping solution (Zero-Cost).
-   **CartoDB Dark Matter**: Premium dark-styled maps that perfectly complement the OLED theme.
-   **Hotspot Detection**: Visual clusters identify areas with high waste density for priority collection.

### 🤖 AI-Powered Classification
-   **Gemini 1.5 Flash**: Leverages Google's latest AI to classify waste (Plastic, Organic, Metal) from photos with incredible speed.
-   **Smart Reporting**: Automatically populates categories and suggests descriptions based on AI analysis.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS3 (Custom OLED System), JavaScript (ES6+ SPA) |
| **Mapping** | Leaflet.js, OpenStreetMap, CartoDB Tiles |
| **Backend** | Node.js, Express.js |
| **Database** | **Supabase (PostgreSQL)** — High-performance cloud database |
| **AI/ML** | Google Gemini 1.5 Flash (via Generative AI SDK) |
| **UI Utils** | Font Awesome 6.0, Chart.js, Custom Toast/Modal Library |

---

## 🚀 Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
-   A **Supabase** Project (URL and Service Key)
-   A **Gemini AI** API Key

### Installation

1. **Clone & Install:**
   ```powershell
   git clone <repository-url>
   cd Smart-Waste-Mapping-Platform
   npm install
   cd backend
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the `backend/` directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3000
   ```

3. **Database Setup:** 
   Run the SQL provided in your Supabase SQL editor to create the `users` (with `impact_score`) and `waste_reports` tables.

4.  **Launch:**
    From the root directory, run the unified application runner:
    ```powershell
    node run-app.js
    ```
    -   **Unified App URL**: [http://localhost:8080](http://localhost:8080)
    -   **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 📂 Directory Structure

```text
├── backend/
│   ├── server.js           # Express API & DB Logic
│   ├── db.js               # Supabase Client Initialization
│   └── .env                # Secure Keys
├── frontend/
│   ├── index.html          # SPA Core Shell
│   ├── admin.html          # Overview Dashboard
│   ├── ui-utils.js         # Custom Modal/Toast Library
│   ├── router.js           # Client-side SPA Routing
│   ├── style.css           # OLED Theme System
│   └── [map/report/etc]    # Specialized modules
└── README.md
```

---

## ✍️ Author
**Vijayapandian T**
-   GitHub: [@VIJAYAPANDIANT](https://github.com/VIJAYAPANDIANT)
-   Project: [Smart-Waste-Mapping-Platform](https://github.com/VIJAYAPANDIANT/Smart-Waste-Mapping-Platform)
