const {db, admin} = require('../utils/admin');
const firebase = require('firebase');
const firebaseConfig = require('../utils/config');
const {validateSignupInput, validateLoginInput, reduceUserDetails} = require('../utils/validators');
firebase.initializeApp(firebaseConfig);

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    const {errors, valid} = validateSignupInput(newUser);
    if (!valid) {
        return res.status(400).json(errors);
    }
    let userId, tkn;
    const noImg = 'no-avatar.png';
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({handle: `this handle is already taken`});
            }
            return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password);
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            tkn = token;
            const userCredentials = {
                userId: userId,
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token: tkn});
        })
        .catch(err => {
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({email: 'Email is already in use'});
            }
            return res.status(500).json({general: 'Something went wrong, please try again'});
        })
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {errors, valid} = validateLoginInput(user);

    if (!valid) {
        return res.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(creds => {
            return creds.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({general: 'Wrong credentials. Please try again.'});
        })
};

exports.addUserDetails = (req, res) => {
    const userDetails = reduceUserDetails(req.body);
    db
        .doc(`/users/${req.user.handle}`)
        .update(userDetails)
        .then(() => {
            return res.json({message: `Details added successfully`});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
}

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db
        .doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get()
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            })
            return db
                .collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get()
        })
        .then(collection => {
            userData.notifications = [];
            collection.forEach(snap => {
                userData.notifications.push({...snap.data(), notificationId: snap.id});
            })
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
}

exports.imageUpload = (req, res) => {
    const Busboy = require('busboy');
    const path = require('path');
    const fs = require('fs');
    const os = require('os');

    const busboy = new Busboy({headers: req.headers});
    let imageFilename, imageToBeUploaded;
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/jpg' && mimetype !== 'image/png') {
            return res.status(400).json({error: 'Wrong file extension'});
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFilename = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFilename}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({imageUrl});
            })
            .then(() => {
                return res.json({message: `Image uploaded successfully`});
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({error: err});
            })
    });
    busboy.end(req.rawBody);
}

// Get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({error: 'User not found'});
            }
            userData.user = doc.data();
            return db
                .collection('screams')
                .where('userHandle', '==', req.params.handle)
                .orderBy('createdAt', 'desc')
                .get()
        })
        .then(collection => {
            userData.screams = [];
            collection.forEach(snap => {
                userData.screams.push({...snap.data(), screamId: snap.id});
            })
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: 'Something went wrong'});
        })
}

exports.markNotificationsRead = (req, res) => {
    const batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true});
    })
    batch.commit()
        .then(() => {
            return res.json({message: 'Notifications mark read'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: 'Something went wrong'});
        })
};