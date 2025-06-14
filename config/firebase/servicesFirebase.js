// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./path-to-your-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = {
  admin,
  db
};
