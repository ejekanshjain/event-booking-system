if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET

const { User } = require('../../models')
const { transformDateToString } = require('../../util')

const createUser = async args => {
    try {
        const { email, password } = args.userInput
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            password: hashedPassword
        })
        return {
            ...user._doc,
            createdAt: transformDateToString(user.createdAt),
            updatedAt: transformDateToString(user.updatedAt),
            password: null,
            createdEvents: null
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

const login = async args => {
    try {
        const { email, password } = args
        const foundUser = await User.findOne({ email })
        if (!foundUser)
            throw new Error('User Does Not Exists')
        if (!(await bcrypt.compare(password, foundUser.password)))
            throw new Error('Password is Incorrect')
        return {
            userId: foundUser._id,
            token: jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: {
                    _id: foundUser._id
                }
            }, secretKey),
            expiration: 1
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    createUser,
    login
}