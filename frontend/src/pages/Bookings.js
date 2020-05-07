import React, { useState, useEffect, useContext } from 'react'

import UserContext from '../context/UserContext'
import Spinner from '../components/Spinner'
import BookingList from '../components/BookingList'
import BookingsChart from '../components/BookingsChart'
import './Bookings.css'

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])
    const [outputType, setOutputType] = useState('list')
    const user = useContext(UserContext)
    const changeOutputType = type => {
        if (type === 'chart') {
            setOutputType('chart')
        } else {
            setOutputType('list')
        }
    }
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
                            price
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
            {!isLoading && <div className="output-type-control">
                <button type="button" className={outputType === 'list' ? 'active' : ''} onClick={() => changeOutputType('list')}>List</button>
                <button type="button" className={outputType === 'chart' ? 'active' : ''} onClick={() => changeOutputType('chart')}>Chart</button>
            </div>}
            {outputType === 'list'
                ? <BookingList bookings={bookings} onDelete={cancelBooking} />
                : <div className="chart">
                    <BookingsChart bookings={bookings} />
                </div>
            }
        </div>
    )
}

export default Bookings