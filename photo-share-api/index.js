const { ApolloServer } = require(`apollo-server`)
const { GraphQLSclarType } = require(`graphql`)

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
        inPhotos: [Photo!]!
    }

    scalar DateTime
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        created: DateTime!
        postedBy: User!
        taggedUsers: [User!]!
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
var tags = [
    {"photoID": "1", "userId": "githubUser1"},
    {"photoID": "2", "userId": "githubUser1"},
    {"photoID": "2", "userId": "githubUser2"},
    {"photoID": "2", "userId": "githubUser3"},
]
var users = [
    {"githubLogin": "githubUser1", "name": "name1"},
    {"githubLogin": "githubUser2", "name": "name2"},
    {"githubLogin": "githubUser3", "name": "name3"},
]
var photos = [
    {
        "id": "1",
        "name": "name1",
        "description": "description1",
        "category": "ACTION",
        "githubUser": "githubUser1",
        "created": "1-2-1985"
    },
    {
        "id": "2",
        "name": "name2",
        "description": "description2",
        "category": "ACTION",
        "githubUser": "githubUser2",
        "created": "1-2-1986"
    },
    {
        "id": "3",
        "name": "name3",
        "description": "description3",
        "category": "ACTION",
        "githubUser": "githubUser3",
        "created": "1-2-1987"
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
                ...args.input,
                created: new Date()
            }

            photos.push(newPhoto)
            return newPhoto
        }
    },
    Photo: {
        url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
        postedBy: parent => {
            return users.find(u => u.githubLogin === parent.githubUser)
        },
        taggedUsers: parent => tags
            .filter(tag => tag.photoID === parent.id)
            .map(tag => tag.userId)
            .map(userID => users.find(u => u.githubLogin === userID))
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.githubUser === parent.githubLogin)
        },
        inPhotos: parent => tags
            .filter(tag => tag.userID === parent.id)
            .map(tag => tag.photoID)
            .map(photoID => photos.find(p => p.id === photoID))
    },
    DateTime: new GraphQLSclarType({
        name: `DateTime`,
        description: `A valid date time value.`,
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString,
        parseLiteral: ast => ast.value
    })
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server
    .listen()
    .then(({url}) => console.log(`GraphQL Service running on ${url}`))
