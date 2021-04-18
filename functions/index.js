const functions = require("firebase-functions");

const app = require('express')();

const FbAuth = require('./util/FbAuth');

const { db } = require('./util/admin');

const { getAllProjects, postOneProject, getProject, commentOnProject } = require('./handlers/projects');
const { signup, login, uploadImage, addUserDetails, getAuthUser } = require('./handlers/users');

// Project routes

//Get projects
app.get('/projects', getAllProjects);

// Post one project
app.post('/project', FbAuth, postOneProject);

app.get('/project/:projectId', getProject);

// DELETE Project

// Like a Project

// Unlike a Project

// Comment on Project
app.post('/project/:projectId/comment', FbAuth, commentOnProject);

// USER routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FbAuth, uploadImage);
app.post('/user', FbAuth, addUserDetails);
app.get('/user', FbAuth, getAuthUser)

// automatically turns into multiple routes
exports.api = functions.region('us-central1').https.onRequest(app);
