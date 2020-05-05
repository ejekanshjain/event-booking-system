import React, { useRef, useState } from 'react'

import './Auth.css'

const Auth = () => {
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
        console.log(result.status)
        if (result.status === 200 || result.status === 201)
            console.log(json)
        else
            console.log({ message: 'Something went wrong', error: json })
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