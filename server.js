if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const expressGraphQL = require('express-graphql')
const { buildSchema } = require('graphql')

const port = process.env.PORT

const app = express()

app.use(express.json())

const events = []

app.use('/graphql', expressGraphQL({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
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
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },

        createEvent: args => {
            const { title, description, price, date } = args.eventInput
            const event = {
                _id: Math.random().toString(),
                title,
                description,
                price,
                date: new Date(date).toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: process.env.NODE_ENV !== 'production' ? true : false
}))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Server started on port ${port}...`))