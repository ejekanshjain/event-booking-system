if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET

const falsy = () => false
const truthy = () => true

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user = jwt.verify(token, secretKey)
        req.isAuthenticated = truthy
        req.user = user.data
        next()
    } catch (err) {
        req.isAuthenticated = falsy
        return next()
    }
}