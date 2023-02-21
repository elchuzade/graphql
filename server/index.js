const express = require('express')
const colors = require('colors')
const cors = require('cors')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const connectDB = require('./config/db')
const schema = require('./schema/schema')
const app = express()

connectDB()

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development'
}))

const port = process.env.PORT || 5002

app.listen(port, () => console.log(`running on port ${port}`))