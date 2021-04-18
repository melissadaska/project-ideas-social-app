let db = {
    users: [
        {
            userId: '29duqLO9bNZY8rtpdTZ2L5ewAf63',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2021-04-10T13:53:01.302Z',
            imageUrl: '',
            bio: 'Hello, my name is user. Nice to meet you.',
            website: 'https://user.com',
            location: 'Austin, TX'
        }
    ],
    projects: [
        {
            userHandle: 'user',
            body: 'This is a sample project.',
            createdAt: '2021-04-12T08:52:52.7982',
            likeCount: 10,
            commentCount: 5
        }
    ],
    comments: [
        {
            userHandle: 'user',
            projectId: 'oihewgoweghoweg',
            body: 'That is a good one!',
            createdAt: '2021-03-15T08:28:52.7952'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: '29duqLO9bNZY8rtpdTZ2L5ewAf63',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2021-04-10T13:53:01.302Z',
        imageUrl: 'image/whoefhawoefhweioghaeiwohg',
        bio: 'Hello, my name is user. Nice to meet you.',
        website: 'https://user.com',
        location: 'Austin, TX'
    },
    likes: [
        {
            userHandle: 'user',
            projectId: ''
        },
        {
            userHandle: 'user',
            projectId: ''
        }
    ]
}
