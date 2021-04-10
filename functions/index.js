const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/projects', (request, response) => {
    admin
        .firestore()
        .collection('projects')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let projects = [];
            data.foreEach(doc => {
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

    admin.firestore()
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

//https://baseurl.com/api/
// automatically turns into multiple routes
exports.api = functions.https.onRequest(app);
