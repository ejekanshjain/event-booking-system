import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Auth from './pages/Auth'
import Events from './pages/Events'
import Bookings from './pages/Bookings'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth" component={Auth} exact />
                <Route path="/events" component={Events} exact />
                <Route path="/bookings" component={Bookings} exact />
            </Switch>
        </BrowserRouter>
    )
}

export default App