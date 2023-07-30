const { ApolloServer } = require(`apollo-server`)

const typeDefs = `
    type Query {
        totalPhots: Int!
    }

    type Mutation {
        postPhoto(name: String! description: String): Boolean!
    }
`

var photos = []

const resolvers = {
    Query: {
        totalPhots: () => photos.length
    },

    Mutation: {
        postPhoto(parent, args) {
            photos.push(args)
            return true
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
