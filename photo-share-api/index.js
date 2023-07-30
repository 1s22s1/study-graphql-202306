const { ApolloServer } = require(`apollo-server`)

const typeDefs = `
    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
    }

    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
    }

    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }

    type Query {
        totalPhots: Int!
        allPhotos: [Photo!]!
    }

    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`

var _id = 0
var users = [
    {"githubLogin": "githubUser1", "name": "name1"},
    {"githubLogin": "githubUser2", "name": "name2"},
    {"githubLogin": "githubUser3", "name": "name3"},
]
var photos = [
    {
        "id": 1,
        "name": "name1",
        "description": "description1",
        "category": "ACTION",
        "githubUser": "githubUser1"
    },
    {
        "id": 2,
        "name": "name2",
        "description": "description2",
        "category": "ACTION",
        "githubUser": "githubUser2"
    },
    {
        "id": 3,
        "name": "name3",
        "description": "description3",
        "category": "ACTION",
        "githubUser": "githubUser3"
    },
]

const resolvers = {
    Query: {
        totalPhots: () => photos.length,
        allPhotos: () => photos
    },
    Mutation: {
        postPhoto(parent, args) {
            var newPhoto = {
                id: _id++,
                ...args.input
            }

            photos.push(newPhoto)
            return newPhoto
        }
    },
    Photo: {
        url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
        postedBy: parent => {
            return users.find(u => u.githubLogin === parent.githubUser)
        }
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.githubUser === parent.githubLogin)
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server
    .listen()
    .then(({url}) => console.log(`GraphQL Service running on ${url}`))
