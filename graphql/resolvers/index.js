const bcrypt = require('bcryptjs')

const { User, Event } = require('../../models')

const user = async userId => {
    try {
        const user = await User.findOne({ _id: userId })
        return {
            ...user._doc,
            password: null,
            createdAt: new Date(user.createdAt).toISOString(),
            updatedAt: new Date(user.updatedAt).toISOString(),
            createdEvents: events.bind(this, user.createdEvents)
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                createdAt: new Date(event.createdAt).toISOString(),
                updatedAt: new Date(event.updatedAt).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
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
                createdAt: new Date(user.createdAt).toISOString(),
                updatedAt: new Date(user.updatedAt).toISOString(),
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
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event.date).toISOString(),
                    createdAt: new Date(event.createdAt).toISOString(),
                    updatedAt: new Date(event.updatedAt).toISOString(),
                    creator: user.bind(this, event.creator)
                }
            })
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
            return {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                createdAt: new Date(event.createdAt).toISOString(),
                updatedAt: new Date(event.updatedAt).toISOString(),
                creator: user.bind(this, event.creator)
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}