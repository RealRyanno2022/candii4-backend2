const admin = require('firebase-admin');
const serviceAccount = require('./candii-a8618-firebase-adminsdk-ssavy-7006eb0d3a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;