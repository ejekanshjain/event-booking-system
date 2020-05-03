const { Event, Booking } = require('../../models')
const { transformEvent, transformBooking } = require('./transformations')

const bookings = async () => {
    try {
        const bookings = await Booking.find()
        return bookings.map(booking => {
            return transformBooking(booking)
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const bookEvent = async args => {
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
}

const cancelBooking = async args => {
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

module.exports = {
    bookings,
    bookEvent,
    cancelBooking
}