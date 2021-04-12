const { db, admin } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignUpData, validateLoginData } = require('../util/validators');

exports.signup = (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
    };

    const { valid , errors } = validateSignUpData(newUser);

    if(!valid) return response.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists) {
            return response.status(400).json({ handle: 'this handle is already taken' });
        } else {
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle, 
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageurl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then((data) => {
        return response.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use') {
            return response.status(400).json({ email: `Email is already in use`})
        } else {
            return response.status(500).json({ error: err.code });
        }
    })
}

exports.login = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password,
    };

    const { valid , errors } = validateLoginData(user);

    if(!valid) return response.status(400).json(errors);
    
    // let errors = {};

    if(isEmpty(user.email)) errors.email = 'Must not be empty';
    if(isEmpty(user.password)) errors.password = 'Must not be empty';

    if(Object.keys(errors).length > 0) return response.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return response.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password') {
            return response.status(403).json({ general: 'Wrong credentials, please try again'});
        } else return response.status(500).json({ error: err.code });
    });
}

exports.uploadImage = (request, response ) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('is');
    const fs = require('fs');

    const busboy = new Busboy({ headers: request.headers });

    let imageFileName;
    let imageToBeUploadted = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype ) => {
        console.log(fieldName);
        console.log(fileName);
        console.log(mimetype);
        // my.image.png
        const imageExtension = filename.split('.')[filename.split('.'.length - 1)];
        const imageFileName = `${Math.round(Math.random() * 10000000000)}.${ImageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype };
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
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${request.user.handle}`).update({ imageUrl });
        })
        .then(() => {
            return response.json({ message: 'image uploaded successfully' });
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
    });
    busboy.end(request.rawBody);
};
