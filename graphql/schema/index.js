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

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
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
        bookings: [Booking!]!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        createEvent(eventInput: EventInput): Event
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)