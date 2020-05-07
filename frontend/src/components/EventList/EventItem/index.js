import React from 'react'

import './style.css'

const EventItem = props => (
    <li className="event-list-item" key={props.event._id}>
        <div>
            <h1>{props.event.title}</h1>
            <h2>{props.event.price} - {new Date(props.event.date).toLocaleDateString()} {new Date(props.event.date).toLocaleTimeString()}</h2>
        </div>
        <div>
            {props.event.creator._id === props.userId
                ? <p>You are the owner of this event.</p>
                : <button type="button" className="btn" onClick={props.onDetail.bind(this, props.event._id)}>View Details</button>}
        </div>
    </li>
)

export default EventItem