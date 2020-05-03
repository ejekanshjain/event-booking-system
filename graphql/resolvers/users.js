const bcrypt = require('bcryptjs')

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

module.exports = {
    createUser
}