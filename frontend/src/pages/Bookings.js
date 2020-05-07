import React, { useState, useEffect, useContext } from 'react'

import UserContext from '../context/UserContext'
import Spinner from '../components/Spinner'
import BookingList from '../components/BookingList'

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])
    const user = useContext(UserContext)
    const fetchBookings = async () => {
        setIsLoading(true)
        const data = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `
        }
        const result = await fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await result.json()
        if (result.status === 200 || result.status === 201) {
            console.log(json)
            if (json.data.bookings) {
                setBookings(json.data.bookings)
            }
        }
        else {
            console.log({ message: 'Something went wrong', error: json })
        }
        setIsLoading(false)
    }
    const cancelBooking = async bookingId => {
        const data = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
                    }
                }
            `
        }
        const result = await fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await result.json()
        if (result.status === 200 || result.status === 201) {
            console.log(json)
            if (json.data.cancelBooking) {
                setBookings(prevBookings => {
                    return prevBookings.filter(booking => bookingId !== booking._id)
                })
            }
        }
        else {
            console.log({ message: 'Something went wrong', error: json })
        }
    }
    useEffect(() => {
        fetchBookings()
    }, [])
    return (
        <div>
            {isLoading && <Spinner />}
            <BookingList bookings={bookings} onDelete={cancelBooking} />
        </div>
    )
}

export default Bookings