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
}

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
}
