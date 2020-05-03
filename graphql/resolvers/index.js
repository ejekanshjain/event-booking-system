const bcrypt = require('bcryptjs')

const { User, Event, Booking } = require('../../models')

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

const event = async eventId => {
    try {
        const event = await Event.findOne({ _id: eventId })
        return {
            ...event._doc,
            createdAt: new Date(event.createdAt).toISOString(),
            updatedAt: new Date(event.updatedAt).toISOString(),
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    createUser: async args => {
        try {
            const { email, password } = args.userInput
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
        try {
            const { title, description, price, date } = args.eventInput
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
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString(),
                    event: event.bind(this, booking.event),
                    user: user.bind(this, booking.user)
                }
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    bookEvent: async args => {
        try {
            const foundEvent = await Event.findOne({ _id: args.eventId })
            if (!foundEvent)
                throw new Error('Booking Not Found')
            const booking = await Booking.create({
                event: args.eventId,
                user: '5eae1316df974d1e4823ebca'
            })
            return {
                ...booking._doc,
                createdAt: new Date(booking.createdAt).toISOString(),
                updatedAt: new Date(booking.updatedAt).toISOString(),
                event: event.bind(this, booking.event),
                user: user.bind(this, booking.user)
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking.findOne({ _id: args.bookingId }).populate('event')
            const event = {
                ...booking.event._doc,
                createdAt: new Date(booking.event.createdAt).toISOString(),
                updatedAt: new Date(booking.event.updatedAt).toISOString(),
                creator: user.bind(this, booking.event.creator)
            }
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}