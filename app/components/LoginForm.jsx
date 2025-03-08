'use client'
import { useEffect, useState } from 'react';

export default function LoginForm(params) {
    // States
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        }) // Make HTTP request to the login API

        const status = res.status
        const data = await res.json() // Retrieve the response's metadata

        if (res.ok){
            setMessage('Logged in succesfully!')
        } else {
            switch (status){
                case 404:
                    setMessage('Could not find the relevant user.')
                    break;
                case 401:
                    setMessage('The password is not matching.')
                    break;
                default:
                    setMessage(data.message || 'An unexpected error has occured.')
            }
        }
    }

    return (
        <div className='mx-auto mt-5 bg-gray-900 rounded-md w-[400px] h-[300px]'>
            <h1 className='text-white font-bold p-4 text-xl'>Login</h1>
            <h2 className='text-gray-300 p-4 py-0 -mt-3 text-md'>Enter your email and password to login.</h2>

            <form onSubmit={handleSubmit} className='flex flex-col items-center mt-2'>
                <label htmlFor='email' className='text-white'>Email</label>
                <input onChange={ (e) => setEmail(e.target.value) } type='text' name='email' className='text-white outline-none rounded-md w-3/4 h-8 text-md px-2 border' required/>
            
                <label htmlFor='email' className='mt-3 text-white'>Password</label>
                <input onChange={ (e) => setPassword(e.target.value) } type='password' name='password' className='text-white rounded-md outline-none w-3/4 h-8 text-md px-2 border' required/>
                
                <p className='mt-3 text-white'>{message}</p>

                <input type='submit' value='Login' className='bg-white outline-none text-black w-3/4 h-8 mt-2 rounded-md'/>
            </form>
        </div>
    );
};
