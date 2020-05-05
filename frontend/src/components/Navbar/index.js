import React from 'react'
import { NavLink } from 'react-router-dom'

import './style.css'

const Navbar = () => (
    <header className="navbar">
        <div className="navbar-logo">
            <h1>
                Eventify
            </h1>
        </div>
        <nav className="navbar-nav">
            <ul>
                <li>
                    <NavLink to="/auth">Register</NavLink>
                </li>
                <li>
                    <NavLink to="/events">Events</NavLink>
                </li>
                <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                </li>
            </ul>
        </nav>
    </header>
)

export default Navbar