# Smart Waste Mapping Platform - Deployment & Setup Guide

This guide provides step-by-step instructions to deploy the Smart Waste Mapping Platform.

## 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project called "Smart Waste Mapping".
3. In the project settings, go to **Service Accounts** and click **Generate new private key**.
4. Save the downloaded JSON file as `backend/config/serviceAccountKey.json`.
5. Enable **Firestore Database** in the Firebase console and create a collection named `waste_reports`.

## 2. Google Maps API Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Enable **Maps JavaScript API** and **Visualization Library**.
4. Create an API Key in **Credentials**.
5. Replace `YOUR_API_KEY` in `frontend/map.html` with your actual key.

## 3. Local Development
1. **Backend**:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   The server will run on `http://localhost:3000`.

2. **Frontend**:
   Simply open `frontend/index.html` in your browser. Ensure the backend is running for the Report and Map features to work.

## 4. Deployment

### Hosting Frontend (Firebase Hosting)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` and `firebase init`.
3. Choose **Hosting** and select your project.
4. Set the public directory to `frontend`.
5. Run `firebase deploy`.

### Hosting Backend
- You can host the Express server on **Render**, **Heroku**, or **Google Cloud Run**.
- Ensure you set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` or include the service account key.
- Update the API URLs in `report.js`, `map.js`, and `admin.js` from `localhost:3000` to your production URL.

## Hotspot Detection Feature
The platform automatically clusters waste reports using a density-based heatmap algorithm. Areas with high concentrations of reports will appear as bright "hotspots" on the map, allowing authorities to prioritize cleanup.
