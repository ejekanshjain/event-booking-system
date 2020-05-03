const { User, Event } = require('../../models')
const { transformDateToString } = require('../../util')

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

module.exports = {
    user,
    events,
    events,
    transformEvent,
    transformBooking
}