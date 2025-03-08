'use client'
import React, { useState } from "react";

export default function AdminForm(params) {
    const { clinicId } = params

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [link, setLink] = useState('Link will appear here...')
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        const res = await fetch('/api/getLink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clinicId: clinicId, name: name, age: age })
        }) // Make HTTP request to the login API

        const status = res.status
        const data = await res.json() // Retrieve the response's metadata

        if (res.ok){
            const link = "http://localhost:3000/chat/" + data.token
            setLink( link )
        } else {
            setLink('Error retrieving link')
        }
    }

    return (
        <form onSubmit={ handleSubmit } className='flex flex-col p-5 mx-auto mt-15 w-[300px] h-auto space-y-3 bg-white rounded-md' >
            <input onChange={ (e) => setName(e.target.value) }  type='text' className='bg-gray-500 px-2 py-1' placeholder='Name of patient...' name='name'></input>
            <input onChange={ (e) => setAge(e.target.value) } type='number' className='bg-gray-500 px-2 py-1' placeholder='Age...' name='age'></input>
            <input type='submit' className='bg-gray-800 px-2 py-1' value='Create Link'></input>
            <p className='text-center text-blue-700 break-words'>{link}</p>
        </form>
    );
};
