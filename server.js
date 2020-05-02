if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const expressGraphQL = require('express-graphql')
const { buildSchema } = require('graphql')

const { MongoDB } = require('./db')
const { Event } = require('./models')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.use('/graphql', expressGraphQL({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            createdAt: String!
            updatedAt: String!
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
        events: async () => {
            try {
                let events = await Event.find()
                return events
            } catch (err) {
                console.log(err)
                throw err
            }
        },

        createEvent: async args => {
            const { title, description, price, date } = args.eventInput
            try {
                const event = await Event.create({
                    title,
                    description,
                    price,
                    date: new Date(date)
                })
                console.log(event)
                return event
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    graphiql: process.env.NODE_ENV !== 'production' ? true : false
}))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Server started on port ${port}...`))