import React, { useState, useRef, useContext, useEffect } from 'react'

import './Events.css'
import Modal from '../components/Modal'
import Backdrop from '../components/Backdrop'
import UserContext from '../context/UserContext'
import EventList from '../components/EventList'
import Spinner from '../components/Spinner'

const Events = () => {
    const [creating, setCreating] = useState(false)
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const user = useContext(UserContext)
    const titleRef = useRef()
    const descriptionRef = useRef()
    const priceRef = useRef()
    const dateRef = useRef()
    const startCreating = () => setCreating(true)
    const stopCreating = () => {
        setCreating(false)
        setSelectedEvent(null)
    }
    const fetchEvents = async () => {
        setIsLoading(true)
        const data = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
        const result = await fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await result.json()
        if (result.status === 200 || result.status === 201) {
            console.log(json)
            if (json.data.events) {
                setEvents(json.data.events)
            }
        }
        else {
            console.log({ message: 'Something went wrong', error: json })
        }
        setIsLoading(false)
    }
    useEffect(() => {
        fetchEvents()
    }, [])
    const addEventHandler = async () => {
        stopCreating()
        const title = titleRef.current.value
        const description = descriptionRef.current.value
        const price = +priceRef.current.value
        const date = dateRef.current.value + ''
        if (!title || !description || price < 0 || !date)
            return alert('Title, sescription , price and date is required')
        const data = {
            query: `
                mutation {
                    createEvent (eventInput: { title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        price
                        date
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
            if (json.data.createEvent) {
                setEvents(prevEvents => {
                    return [
                        ...prevEvents,
                        {
                            _id: json.data.createEvent._id,
                            title: json.data.createEvent.title,
                            description: json.data.createEvent.description,
                            price: json.data.createEvent.price,
                            date: json.data.createEvent.date,
                            creator: {
                                _id: user._id
                            }
                        }
                    ]
                })
            }
        }
        else {
            console.log({ message: 'Something went wrong', error: json })
        }
    }
    const showEventDetailHandler = async eventId => {
        const selectedEvent = events.find(e => e._id === eventId)
        setSelectedEvent(selectedEvent)
    }
    const bookEventHandler = async () => {
        const data = {
            query: `
                mutation {
                    bookEvent (eventId: "${selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
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
        }
        else {
            console.log({ message: 'Something went wrong', error: json })
        }
        setSelectedEvent(null)
    }
    return (
        <div>
            {creating || selectedEvent ? <Backdrop /> : null}
            {creating && <Modal title="Create Event" canCancel canConfirm onConfirm={addEventHandler} onCancel={stopCreating}>
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={titleRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={priceRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" ref={dateRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="4" ref={descriptionRef}></textarea>
                    </div>
                </form>
            </Modal>}
            {
                selectedEvent && (
                    <Modal title={selectedEvent.title} canCancel canConfirm={user.token} onConfirm={bookEventHandler} onCancel={stopCreating} confirmText="Book">
                        <h2>{selectedEvent.title}</h2>
                        <h4>Price - {selectedEvent.price}</h4>
                        <h4>Date - {new Date(selectedEvent.date).toLocaleDateString()} {new Date(selectedEvent.date).toLocaleTimeString()}</h4>
                        <h4>Created By - {selectedEvent.creator.email}</h4>
                        <p>{selectedEvent.description}</p>
                    </Modal>
                )
            }
            {user.token && <div className="events-control">
                <p>Create your own event</p>
                <button type="button" className="btn" onClick={startCreating}>Create Event</button>
            </div>}
            {isLoading
                ? <Spinner />
                : <EventList events={events} userId={user.userId} onViewDetail={showEventDetailHandler} />}
        </div>
    )
}

export default Events