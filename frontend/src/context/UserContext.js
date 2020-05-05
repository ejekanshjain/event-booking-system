import React from 'react'

export default React.createContext({
    userId: null,
    token: null,
    expiration: null,
    login: (userId, token, expiration) => { },
    logout: () => { }
})