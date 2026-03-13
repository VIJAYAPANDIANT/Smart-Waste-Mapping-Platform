# ♻️ SmartWaste Mapping Platform

A premium, modern web application designed to empower communities to track, report, and manage waste effectively. Featuring AI-powered classification and interactive mapping with Zero-Cost infrastructure.

---

## ✨ Key Features

### 🌓 Dual-Mode Interface (Light & Dark)
-   **Dynamic Theme Switcher**: Toggle between a professional light theme and a high-contrast dark theme (pure black background).
-   **Persistent Preference**: Your theme choice is automatically saved in `localStorage`.
-   **Dynamic Component Scaling**: Map tiles and Admin charts automatically swap colors/tiles to ensure perfect legibility in both modes.

### 🗺️ Intelligent Waste Mapping
-   **Free & Independent**: Completely migrated from Google Maps to **Leaflet.js**, eliminating the need for paid API keys or credit card verification.
-   **Custom Dark Map**: Uses **CartoDB Dark Matter** tiles for a stunning, premium aesthetic in dark mode.
-   **Hotspot Detection**: Visual clusters identify areas with high waste density.
-   **Recycling Center Locator**: Integrated markers for nearby plastic, metal, and organic recycling facilities.

### 🤖 AI-Powered Waste Classification
-   **Gemini AI Integration**: Upload a photo of waste to get instant categorization (Plastic, Organic, Metal) with high confidence.
-   **Automated Reporting**: AI-detected categories are auto-selected in the report form for faster submission.

### 📱 Mobile-First Design
-   **Fully Responsive**: Optimized for phones, tablets, and desktops.
-   **Adaptive Navigation**: Feature-rich hamburger menu and stacked cards for small screens.

### 📊 Admin Dashboard
-   **Live Statistics**: Real-time counters for total, pending, and resolved reports.
-   **Data Visualization**: Integrated **Chart.js** doughnut charts showing report distribution by area.
-   **Report Management**: Audit, approve, or delete user reports with ease.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS3 (Custom Variables), JavaScript (ES6+) |
| **Mapping** | Leaflet.js, OpenStreetMap, CartoDB Tiles |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **AI/ML** | Google Gemini 1.5 Flash (via Generative AI SDK) |
| **Icons** | Font Awesome 6.0 |

---

## 🚀 Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) installed (v16.x or higher)
-   A Firebase project (see Configuration)

### Installation

1. **Clone the repository:**
   ```powershell
   git clone <repository-url>
   cd Smart-Waste-Mapping-Platform
   ```

2. **Install Dependencies:**
   Install for both the root and backend folders:
   ```powershell
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Start the Application:**
   Use the unified runner to start both the Frontend and Backend simultaneously:
   ```powershell
   node run-app.js
   ```
   -   **Frontend**: [http://localhost:8080](http://localhost:8080)
   -   **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### 1. Firebase (Required for Reports)
1.  Create a project in the [Firebase Console](https://console.firebase.google.com/).
2.  Go to **Service Accounts** and generate a new private key.
3.  Save the JSON file as `backend/config/serviceAccountKey.json`.
4.  Enable **Firestore Database** and create a collection named `waste_reports`.

### 2. Gemini AI (Optional for AI Classification)
1.  Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2.  Add your key to `backend/.env`:
    ```env
    GEMINI_API_KEY=your_actual_key_here
    ```
    *If no key is provided, the system will use mock classification for demonstration.*

---

## 📂 Directory Structure

```text
├── backend/
│   ├── config/             # Firebase configuration
│   ├── server.js           # Express API server
│   └── .env                # API Keys (Protected)
├── frontend/
│   ├── index.html          # Landing Page
│   ├── report.html         # Waste Reporting Form
│   ├── map.html            # Leaflet Map View
│   ├── awareness.html      # Segregation Guide
│   ├── admin.html          # Management Dashboard
│   ├── style.css           # Global Themes & Layouts
│   ├── theme-toggle.js      # Light/Dark logic
│   └── [js files]          # Component-specific logic
├── run-app.js              # Unified Application Runner
└── README.md
```

---

## ✍️ Author
**Vijayapandian T**
-   GitHub: [@VIJAYAPANDIANT](https://github.com/VIJAYAPANDIANT)
-   Project: [Smart-Waste-Mapping-Platform](https://github.com/VIJAYAPANDIANT/Smart-Waste-Mapping-Platform)
