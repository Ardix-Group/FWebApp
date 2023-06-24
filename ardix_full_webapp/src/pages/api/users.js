import admin from 'firebase-admin';

const serviceAccount = require('../../config/FirebaseConfig');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyC9xkiO8fFVUjJBaB3UsHnUWmq_P5xi8Gk",
    authDomain: "ardix-group-2.firebaseapp.com",
    projectId: "ardix-group-2",
    storageBucket: "ardix-group-2.appspot.com",
    messagingSenderId: "991834990652",
    appId: "1:991834990652:web:59f26ada6a7a9d3c72fb39",
    measurementId: "G-FJ1PVJ65YL"
  });
}

export default async function handler(req, res) {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => userRecord.toJSON());

    res.status(200).json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
}
