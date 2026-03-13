const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
    } else {
        admin.initializeApp({
            projectId: 'demo-project'
        });
    }
}

const db = admin.firestore();

module.exports = { admin, db };
