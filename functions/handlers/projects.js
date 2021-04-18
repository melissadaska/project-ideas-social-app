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
                    createdAt: doc.data().createdAt
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
        createdAt: new Date().toISOString()
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
      return response.status(400).json({ comment: 'Must not be empty' });
  
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
