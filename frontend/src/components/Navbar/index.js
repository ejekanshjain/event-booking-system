import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import './style.css'
import UserContext from '../../context/UserContext'

const Navbar = () => {
    const user = useContext(UserContext)
    const logoutHandler = e => {
        e.preventDefault()
        user.logout()
    }
    return (
        <header className="navbar" >
            <div className="navbar-logo">
                <h1>Eventify</h1>
            </div>
            <nav className="navbar-nav">
                <ul>
                    {!user.token && <li>
                        <NavLink to="/auth">Register</NavLink>
                    </li>}
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {user.token && <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                    </li>}
                    {user.token && <li>
                        <a href="/" type="button" onClick={logoutHandler}>Logout</a>
                    </li>}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar