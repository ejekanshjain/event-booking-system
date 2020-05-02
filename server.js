if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const expressGraphQL = require('express-graphql')
const { buildSchema } = require('graphql')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.use('/graphql', expressGraphQL({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Event 1', 'Event 2']
        },

        createEvent: args => {
            return args.name
        }
    },
    graphiql: process.env.NODE_ENV !== 'production' ? true : false
}))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Server started on port ${port}...`))