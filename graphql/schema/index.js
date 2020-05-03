const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String
        createdAt: String!
        updatedAt: String!
        createdEvents: [Event!]
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        createdAt: String!
        updatedAt: String!
        creator: User!
    }

    input UserInput {
        email: String!
        password: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)