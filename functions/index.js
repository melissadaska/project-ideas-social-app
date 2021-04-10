const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello world!");
});

exports.getProjects = functions.https.onRequest((request, response) => {  
    admin.firestore().collection('projects').get()
        .then(data => {
            let projects = [];
            data.foreEach(doc => {
                projects.push(doc.data());
            });
            return response.json(projects);
        })
        .catch(err => console.error(err));
});

exports.createProject = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        return response.status(400).json({ error: 'Method not allowed' });
    }
    const newProject = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
