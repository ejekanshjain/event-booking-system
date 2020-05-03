const bcrypt = require('bcryptjs')

const { User, Event, Booking } = require('../../models')
const { transformDateToString } = require('../../util')

const transformEvent = event => {
    return {
        ...event._doc,
        date: transformDateToString(event.date),
        createdAt: transformDateToString(event.createdAt),
        updatedAt: transformDateToString(event.updatedAt),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        createdAt: transformDateToString(booking.createdAt),
        updatedAt: transformDateToString(booking.updatedAt),
        event: event.bind(this, booking.event),
        user: user.bind(this, booking.user)
    }
}

const user = async userId => {
    try {
        const user = await User.findOne({ _id: userId })
        return {
            ...user._doc,
            password: null,
            createdAt: transformDateToString(user.createdAt),
            updatedAt: transformDateToString(user.updatedAt),
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
            return transformEvent(event)
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const event = async eventId => {
    try {
        const event = await Event.findOne({ _id: eventId })
        return transformEvent(event)
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
                createdAt: transformDateToString(user.createdAt),
                updatedAt: transformDateToString(user.updatedAt),
                password: null,
                createdEvents: null
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
                return transformEvent(event)
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
                date: transformDateToString(date),
                creator: '5eae1316df974d1e4823ebca'
            })
            await User.updateOne({
                _id: '5eae1316df974d1e4823ebca'
            }, {
                $push: {
                    createdEvents: event._id
                }
            })
            return transformEvent(event)
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
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
            return transformBooking(booking)
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking.findOne({ _id: args.bookingId }).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}