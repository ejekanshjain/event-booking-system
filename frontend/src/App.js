import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Auth from './pages/Auth'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Navbar from './components/Navbar'

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Switch>
                    <Redirect from="/" to="/auth" exact />
                    <Route path="/auth" component={Auth} exact />
                    <Route path="/events" component={Events} exact />
                    <Route path="/bookings" component={Bookings} exact />
                </Switch>
            </main>
        </BrowserRouter>
    )
}

export default App