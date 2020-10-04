import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import './style.css'
import UserContext from '../../context/UserContext'

const Navbar = () => {
    const user = useContext(UserContext)
    return (
        <header className="navbar" >
            <div className="navbar-logo">
                <h2>Eventify</h2>
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
                        <button type="button" onClick={user.logout}>Logout</button>
                    </li>}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
