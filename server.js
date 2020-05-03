if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const expressGraphQL = require('express-graphql')

const { MongoDB } = require('./db')
const graphQLSchema = require('./graphql/schema')
const graphQLResolers = require('./graphql/resolvers')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.use('/graphql', expressGraphQL({
    schema: graphQLSchema,
    rootValue: graphQLResolers,
    graphiql: process.env.NODE_ENV !== 'production' ? true : false
}))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Server started on port ${port}...`))