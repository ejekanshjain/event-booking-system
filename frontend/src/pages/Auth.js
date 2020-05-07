import React, { useRef, useState, useContext } from 'react'

import './Auth.css'
import UserContext from '../context/UserContext'

const Auth = () => {
    const user = useContext(UserContext)
    const [isLogin, setIsLogin] = useState(true)
    const emailRef = useRef()
    const passwordRef = useRef()
    const switchForm = () => {
        setIsLogin(prev => !prev)
    }
    const submitHandler = async e => {
        e.preventDefault()
        const email = emailRef.current.value.trim()
        const password = passwordRef.current.value.trim()
        if (email.length === 0 || password.length === 0)
            return alert('Email and Password is required!')
        let data
        if (isLogin)
            data = {
                query: `
                    {
                        login (email: "${email}", password: "${password}") {
                            userId
                            token
                            expiration
                        }
                    }
                `
            }
        else
            data = {
                query: `
                    mutation {
                        createUser (userInput: { email: "${email}", password: "${password}" }) {
                            _id
                            email
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
            if (json.data.login) {
                user.login(json.data.login.userId, json.data.login.token, json.data.login.expiration)
            } else if (json.data.createUser) {
                alert('Registered Successfully')
                setIsLogin(true)
            } else {
                alert(json.errors[0].message)
            }
        }
        else {
            console.log({ message: 'Something went wrong', error: json })
        }
    }
    return (
        <div>
            <form className="auth-form" onSubmit={submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" ref={emailRef} required />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" ref={passwordRef} required />
                </div>
                <div className="form-actions">
                    <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
                    <button type="button" onClick={switchForm}>Switch to {isLogin ? 'Register' : 'Login'}</button>
                </div>
            </form>
        </div>
    )
}

export default Auth