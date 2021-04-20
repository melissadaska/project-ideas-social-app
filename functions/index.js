const functions = require("firebase-functions");

const app = require('express')();

const FbAuth = require('./util/FbAuth');

const { db } = require('./util/admin');

const { getAllProjects, postOneProject, getProject, commentOnProject, likeProject, unlikeProject, deleteProject } = require('./handlers/projects');
const { signup, login, uploadImage, addUserDetails, getAuthUser, getUserDetails, markNotificationsRead } = require('./handlers/users');
// const { unstable_renderSubtreeIntoContainer } = require("react-dom");

// Project routes

//Get projects
app.get('/projects', getAllProjects);

// Post one project
app.post('/project', FbAuth, postOneProject);

app.get('/project/:projectId', getProject);

// DELETE Project
app.delete('/project/:projectId/delete', FbAuth, deleteProject);

// // Like a Project
app.get('/project/:projectId/like', FbAuth, likeProject);

// // Unlike a Project
app.get('/project/:projectId/unlike', FbAuth, unlikeProject);

// Comment on Project
app.post('/project/:projectId/comment', FbAuth, commentOnProject);

// USER routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FbAuth, uploadImage);
app.post('/user', FbAuth, addUserDetails);
app.get('/user', FbAuth, getAuthUser)
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FbAuth, markNotificationsRead);

// automatically turns into multiple routes
exports.api = functions.region('us-central1').https.onRequest(app);

exports.createNotificationOnLike = functions
  .region('us-central1')
  .firestore
  .document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/projects/${snapshot.data().projectId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            projectId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnLike = functions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete() 
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region('us-central1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/projects/${snapshot.data().projectId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            project: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region('us-central1')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('projects')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const project = db.doc(`/projects/${doc.id}`);
            batch.update(project, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
});

exports.onProjectDelete = functions
  .region('us-central1')
  .firestore.document('/projects/{projectId}')
  .onDelete((snapshot, context) => {
    const projectId = context.params.projectId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('projectId', '==', projectId)
      .get()
      .then((data) => {
        data.forEach((doc) => { 
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('projectId', '==', projectId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('projectId', '==', projectId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
});
