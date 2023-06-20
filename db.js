const admin = require('firebase-admin');
const serviceAccount = require('"C:/Users/danie/Desktop/GuardedPrivateKey(Candii)/candii-app-firebase-adminsdk-herbp-6730a7f3fd.json"');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;