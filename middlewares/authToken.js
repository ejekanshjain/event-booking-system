if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    next()
}