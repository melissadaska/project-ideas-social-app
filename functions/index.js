const functions = require("firebase-functions");
const admin = require('firebase-admin');

const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyBJW82790V4stvO4GGZ8E5GTWyu4mPU9Po",
    authDomain: "project-ideas-social-app-31874.firebaseapp.com",
    databaseURL: "https://project-ideas-social-app-31874.firebaseio.com",
    projectId: "project-ideas-social-app-31874",
    storageBucket: "project-ideas-social-app-31874.appspot.com",
    messagingSenderId: "547801553785",
    appId: "1:547801553785:web:2b1cb5928a73b7c340eda8",
    measurementId: "G-88FHEYNYNT"
  };

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/projects', (request, response) => {
    db
        .collection('projects')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let projects = [];
            data.forEach(doc => {
                projects.push({
                    projectId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return response.json(projects);
        })
        .catch(err => console.error(err));
})

app.post('/project', (request, response) => {
    const newProject = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: newDate().toISOString()
    };

    db
        .collection('projects')
        .add(newProject)
        .then(doc => {
            response.json({message: `document ${doc.id} created successfully`});
        })
        .catch(err => {
            response.status(500).json({error: 'something went wrong'});
            console.error(err);
        });
});

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

app.post('/signup', (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
    };

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = 'Email cannot be empty'
    } else if(!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(newUser.password)) {
        errors.password = 'Cannot be empty'
    }
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

    if(Object.keys(errors).length > 0)return response.status(400).json(errors);

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
});


// automatically turns into multiple routes
exports.api = functions.region('us-central1').https.onRequest(app);
