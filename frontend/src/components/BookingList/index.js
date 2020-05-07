import React from 'react'

import './style.css'

const BookingList = props => {
    return (
        <ul className="booking-list">
            {props.bookings.map(booking => (
                <li key={booking._id} className="booking-list-item">
                    <div className="booking-item-data">
                        {booking.event.title + ' - '}
                        {new Date(booking.event.date).toDateString()}
                        {new Date(booking.event.date).toTimeString()}
                    </div>
                    <div className="booking-item-action">
                        <button type="button" className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default BookingList