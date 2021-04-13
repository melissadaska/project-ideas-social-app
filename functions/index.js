const functions = require("firebase-functions");

const app = require('express')();

const FbAuth = require('./util/FbAuth');

const { db } = require('./util/admin');

const { getAllProjects, postOneProject } = require('./handlers/projects');
const { signup, login, uploadImage, addUserDetails } = require('./handlers/users');

// Project routes

//Get projects
app.get('/projects', getAllProjects);

// Post one project
app.post('/project', FbAuth, postOneProject);

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FbAuth, uploadImage);
app.post('/user', FbAuth, addUserDetails);

// automatically turns into multiple routes
exports.api = functions.region('us-central1').https.onRequest(app);
