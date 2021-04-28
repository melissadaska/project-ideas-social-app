const { db } = require('../util/admin'); 

exports.getAllProjects = (request, response) => {
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
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            return response.json(projects);
        })
        .catch(err => console.error(err));
};

exports.postOneProject = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({ body: 'Body must not be empty' });
    }

    const newProject = {
        body: request.body.body,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('projects')
        .add(newProject)
        .then((doc) => {
            const responseProject = newProject;
            responseProject.projectId = doc.id;
            response.json(responseProject);
        })
        .catch(err => {
            response.status(500).json({error: 'something went wrong'});
            console.error(err);
        });
};

// Fetch one project
exports.getProject = (request, response) => {
    let projectData = {};
    db.doc(`/projects/${request.params.projectId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return response.status(404).json({ error: 'Project not found' });
        }
        projectData = doc.data();
        projectData.projectId = doc.id;
        return db
          .collection('comments')
          .orderBy('createdAt', 'desc')
          .where('projectId', '==', request.params.projectId)
          .get();
      })
      .then((data) => {
        projectData.comments = [];
        data.forEach((doc) => {
            projectData.comments.push(doc.data());
        });
        return response.json(projectData);
      })
      .catch((err) => {
        console.error(err);
        response.status(500).json({ error: err.code });
      });
  };

  // Comment on a comment
  exports.commentOnProject = (request, response) => {
    if (request.body.body.trim() === '')
      return response.status(400).json({ comment: 'Comment must not be empty' });
  
    const newComment = {
      body: request.body.body,
      createdAt: new Date().toISOString(),
      projectId: request.params.projectId,
      userHandle: request.user.handle,
      userImage: request.user.imageUrl
    };
    console.log(newComment);
  
    db.doc(`/projects/${request.params.projectId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return response.status(404).json({ error: 'Project not found' });
        }
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
      })
      .then(() => {
        return db
        .collection('comments')
        .add(newComment);
      })
      .then(() => {
        response.json(newComment);
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({ error: 'Something went wrong' });
      });
  };

  // Like a project
  exports.likeProject = (request, response) => {
      const likeDoc = db.collection('likes').where('userHandle', '==', request.user.handle)
      .where('projectId', '==', request.params.projectId).limit(1);

        const projectDoc = db.doc(`/projects/${request.params.projectId}`);

        let projectData;

        projectDoc.get()
        .then(doc => {
            if(doc.exists){
                projectData = doc.data();
                projectData.projectId = doc.id;
                return likeDoc.get();
            } else {
                return response.status(404).json({ error: 'Project not found' });
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('likes').add({
                    projectId: request.params.projectId,
                    userHandle: request.user.handle
                })
                .then(() => {
                    projectData.likeCount++
                    return projectDoc.update({ likeCount: projectData.likeCount })
                })
                .then(() => {
                    return response.json(projectData);
                })
            } else {
                return response.status(400).json({ error: 'Project already liked' })
            }
        })
        .catch(err => {
            response.status(500).json({ error: err.code });
        });
  };

  exports.unlikeProject = (request, response) => {
    const likeDocument = db
      .collection('likes')
      .where('userHandle', '==', request.user.handle)
      .where('projectId', '==', request.params.projectId)
      .limit(1);
  
    const projectDocument = db.doc(`/projects/${request.params.projectId}`);
  
    let projectData;
  
    projectDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
            projectData = doc.data();
            projectData.projectId = doc.id;
          return likeDocument.get();
        } else {
          return response.status(404).json({ error: 'Scream not found' });
        }
      })
      .then((data) => {
        if (data.empty) {
          return res.status(400).json({ error: 'Scream not liked' });
        } else {
          return db
            .doc(`/likes/${data.docs[0].id}`)
            .delete()
            .then(() => {
                projectData.likeCount--;
              return projectDocument.update({ likeCount: projectData.likeCount });
            })
            .then(() => {
                response.json(projectData);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        response.status(500).json({ error: err.code });
      });
  };

  // Delete project
  exports.deleteProject = (request, response) => {
      const document = db.doc(`/projects/${request.params.projectId}`);
      document.get()
      .then(doc => {
          if(!doc.exists){
              return response.status(404).json({ error: 'Project not found' })
          }
          if(doc.data().userHandle !== request.user.handle){
              return response.status(403).json({ error: 'Unauthorized to delete this project' })
          } else {
              return document.delete();
          }
      })
      .then(() => {
          response.json({ message: 'Project deleted successfully' })
      })
      .catch(err => {
          console.error(err);
          return response.status(500).json({ error: err.code });
      });
  };
