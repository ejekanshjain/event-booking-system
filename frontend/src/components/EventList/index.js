import React from 'react'

import './style.css'
import EventItem from './EventItem'

const EventList = props => {
    const events = props.events.map(event => {
        return (
            <EventItem key={event._id} userId={props.userId} event={event} onDetail={props.onViewDetail} />
        )
    })
    return (
        <ul className="event-list">{events}</ul>
    )
}

export default EventList