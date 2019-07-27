const admin = require('firebase-admin');
// const serviceAccount = require("/home/max/Downloads/socialape-cec95-firebase-adminsdk-4co7f-1ac83a2f3e.json");
// const serviceAccount = require("c:\\socialape-cec95-firebase-adminsdk-4co7f-1ac83a2f3e.json");

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialape-cec95.firebaseio.com",
    storageBucket: "socialape-cec95.appspot.com"
});

const db = admin.firestore();

module.exports = {
    db,
    admin
};