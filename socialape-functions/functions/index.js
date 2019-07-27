const functions = require('firebase-functions');
const app = require('express')();
const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require('./handlers/screams');
const {
    signup,
    login,
    imageUpload,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users');
const FBauth = require('./utils/FBauth');
const {db} = require('./utils/admin');
const cors = require('cors');
app.use(cors());

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBauth, postOneScream);
app.delete('/scream/:screamId', FBauth, deleteScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', FBauth, commentOnScream);
app.get('/scream/:screamId/like', FBauth, likeScream);
app.get('/scream/:screamId/unlike', FBauth, unlikeScream);

// Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBauth, imageUpload);
app.post('/user', FBauth, addUserDetails);
app.get('/user', FBauth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('/likes/{id}')
    .onCreate(snapshot => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        createdAt: new Date().toISOString(),
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
    })

exports.deleteNotificationOnUnlike = functions.region('europe-west1').firestore.document('/likes/{id}')
    .onDelete(snapshot => {
        return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(err => {
                console.error(err);
            })
    })

exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('/comments/{id}')
    .onCreate(snapshot => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        createdAt: new Date().toISOString(),
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
    })

exports.onUserImageChange = functions.region('europe-west1').firestore.document('/users/{userId}').onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
        let batch = db.batch();
        return db.collection('screams')
            .where('userHandle', '==', change.before.data().handle)
            .get()
            .then(snaps => {
                snaps.forEach(snap => {
                    const scream = db.doc(`/screams/${snap.id}`);
                    batch.update(scream, {userImage: change.after.data().imageUrl});
                });
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            });
    } else {
        return true;
    }
})

exports.onScreamsDelete = functions.region('europe-west1').firestore.document('/screams/{screamId}').onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db.collection('comments').where('screamId', '==', screamId).get()
        .then(data => {
            data.forEach(snap => {
                batch.delete(db.doc(`/comments/${snap.id}`));
            })
            return db.collection('likes').where('screamId', '==', screamId).get();
        })
        .then(data => {
            data.forEach(snap => {
                batch.delete(db.doc(`/likes/${snap.id}`));
            })
            return batch.commit();
        })
        .catch(err => {
            console.error(err);
        })
})