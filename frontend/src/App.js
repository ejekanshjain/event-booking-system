import React, { useState } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Auth from './pages/Auth'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Navbar from './components/Navbar'
import UserContext from './context/UserContext'

const App = () => {
    const [user, setUser] = useState({
        userId: null,
        token: null,
        expiration: null
    })
    const login = (userId, token, expiration) => {
        setUser({
            userId,
            token,
            expiration
        })
    }
    const logout = () => {
        setUser({
            userId: null,
            token: null,
            expiration: null
        })
    }
    return (
        <BrowserRouter>
            <UserContext.Provider value={{ userId: user.userId, token: user.token, expiration: user.expiration, login, logout }}>
                <Navbar />
                <main>
                    <Switch>
                        {!user.token && <Redirect from="/" to="/auth" exact />}
                        {!user.token && <Redirect from="/bookings" to="/auth" exact />}
                        {user.token && <Redirect from="/" to="/events" exact />}
                        {user.token && <Redirect from="/auth" to="/" exact />}
                        <Route path="/auth" component={Auth} exact />
                        <Route path="/events" component={Events} exact />
                        <Route path="/bookings" component={Bookings} exact />
                        <Redirect from="*" to="/" />
                    </Switch>
                </main>
            </UserContext.Provider>
        </BrowserRouter>
    )
}

export default App