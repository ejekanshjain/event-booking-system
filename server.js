if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const expressGraphQL = require('express-graphql')
const { buildSchema } = require('graphql')
const bcrypt = require('bcryptjs')

const { MongoDB } = require('./db')
const { User, Event } = require('./models')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.use('/graphql', expressGraphQL({
    schema: buildSchema(`
        type User {
            _id: ID!
            email: String!
            password: String
            createdAt: String!
            updatedAt: String!
        }

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
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
        }

        type RootMutation {
            createUser(userInput: UserInput): User
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        createUser: async args => {
            const { email, password } = args.userInput
            try {
                const hashedPassword = await bcrypt.hash(password, 10)
                const user = await User.create({
                    email,
                    password: hashedPassword
                })
                return {
                    ...user._doc,
                    password: null
                }
            } catch (err) {
                console.log(err)
                throw err
            }
        },

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
                    date: new Date(date),
                    creator: '5eae1316df974d1e4823ebca'
                })
                await User.updateOne({
                    _id: '5eae1316df974d1e4823ebca'
                }, {
                    $push: {
                        createdEvents: event._id
                    }
                })
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