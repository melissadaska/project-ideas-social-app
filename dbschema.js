let db = {
    users: [
      {
        userId: 'dh23ggj5h32g543j5gf43',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2021-04-15T08:30:52.798Z',
        imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
        bio: 'Hello. My name is User. It is nice to meet you.',
        website: 'https://user.com',
        location: 'Austin, TX'
      }
    ],
    projects: [
      {
        userHandle: 'user',
        body: 'Here is a sample project',
        createdAt: '2021-04-15T08:30:52.798Z',
        likeCount: 10,
        commentCount: 5
      }
    ],
    comments: [
      {
        userHandle: 'user',
        projectId: 'kdjsfgdksuufhgkdsufky',
        body: 'Nice project idea!',
        createdAt: '2021-04-15T08:30:52.798Z'
      }
    ],
    notifications: [
      {
        recipient: 'user',
        sender: 'john',
        read: 'true | false',
        projectId: 'kdjsfgdksuufhgkdsufky',
        type: 'like | comment',
        createdAt: '2021-04-15T08:30:52.798Z'
      }
    ]
  };
  const userDetails = {
    // Redux data
    credentials: {
      userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2021-04-15T08:30:52.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello. My name is User. It is nice to meet you.',
      website: 'https://user.com',
      location: 'Austin, TX'
    },
    likes: [
      {
        userHandle: 'user',
        projectId: 'hh7O5oWfWucVzGbHH2pa'
      },
      {
        userHandle: 'user',
        projectId: '3IOnFoQexRcofs5OhBXO'
      }
    ]
  };
