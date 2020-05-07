const { Event, Booking } = require('../../models')
const { transformEvent, transformBooking } = require('./transformations')

const bookings = async (args, req) => {
    try {
        if (!req.isAuthenticated())
            throw new Error('Unauthorized')
        const bookings = await Booking.find({ user: req.user._id })
        return bookings.map(booking => {
            return transformBooking(booking)
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const bookEvent = async (args, req) => {
    try {
        if (!req.isAuthenticated())
            throw new Error('Unauthorized')
        const foundEvent = await Event.findOne({ _id: args.eventId })
        if (!foundEvent)
            throw new Error('Booking Not Found')
        const booking = await Booking.create({
            event: args.eventId,
            user: req.user._id
        })
        return transformBooking(booking)
    } catch (err) {
        console.log(err)
        throw err
    }
}

const cancelBooking = async (args, req) => {
    try {
        if (!req.isAuthenticated())
            throw new Error('Unauthorized')
        const booking = await Booking.findOne({ _id: args.bookingId, user: req.user._id }).populate('event')
        const event = transformEvent(booking.event)
        await Booking.deleteOne({ _id: args.bookingId })
        return event
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    bookings,
    bookEvent,
    cancelBooking
}