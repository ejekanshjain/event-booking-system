const { User, Event } = require('../../models')
const { transformDateToString } = require('../../util')
const { transformEvent } = require('./transformations')

const events = async () => {
    try {
        let events = await Event.find()
        return events.map(event => {
            return transformEvent(event)
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const createEvent = async args => {
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
}

module.exports = {
    events,
    createEvent
}