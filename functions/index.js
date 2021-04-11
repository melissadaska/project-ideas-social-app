const functions = require("firebase-functions");

const app = require('express')();

const FbAuth = require('./util/FbAuth');

const { getAllProjects, postOneProject } = require('./handlers/projects');
const { signup, login } = require('./handlers/users');

// Project routes

//Get projects
app.get('/projects', getAllProjects);

// Post one project
app.post('/project', FbAuth, postOneProject);

// User routes
app.post('/signup', signup);
app.post('/login', login);

// automatically turns into multiple routes
exports.api = functions.region('us-central1').https.onRequest(app);
