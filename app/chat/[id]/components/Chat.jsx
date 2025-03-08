'use client'
import { useRef, useState } from 'react';

let current = 0 // Current expected response

export default function Chat(params) {
    const { token } = params // Extract component parameters

    // Hooks
    const [messages, setMessages] = useState([
        { author: "AI ChatBot", content: "Please, describe your condition as best as you can." }, // Default message
    ]); 
    
    // References
    const inputRef = useRef(null);

    // Event handlers
    const handleSubmit = async (e) => {
        e.preventDefault() // Ensure no page-reload

        const content = inputRef.current.value

        setMessages( (prev) => [...prev, {  
            author: "You",
            content: content
        }] ) // Add the submitted user message

        const response = await fetch('/api/getResponse', {
            method: 'POST',
            body: JSON.stringify({ 
                'current': current, 
                'token': token 
            })
        }) // POST method on getResponse to receive server-sided answer for the current conversation
        
        const data = await response.json() // Convert back from JSON
        current += 1 // Move to the next prepared response for next call
        
        setMessages( (prev) => [...prev, {
            author: "AI ChatBot",
            content: data.content
        }] ) // Add the response

        inputRef.current.value = '' // Clear out the input button
    }

    return (
        <div className='mx-auto max-w-[600px] h-auto min-h-screen bg-slate-700 p-7'>
            <h1>Welcome user! Chat with our bot to so we can learn about your condition.</h1>
            <div className='h-auto min-h-96 w-full bg-white mt-5'>
                {
                    messages.map((msg, index) => {
                        return <div key={index} className={'px-4 py-4 ' + ((index % 2 == 0) ? 'bg-gray-100' : 'bg-gray-300')}>
                            <h2 className='text-black text-md font-bold break-words'>{ msg.author }</h2>
                            <p className='text-gray-700 text-sm break-words'>{ msg.content }</p>
                        </div>
                    })
                }
            </div>

            <form onSubmit={handleSubmit} className='mt-2 flex gap-2'>
                <input ref={inputRef} type='text' name='response' placeholder='Type in your response...' className='w-full bg-slate-500 px-2 py-1 outline-none'/>
                <input value='Send' type='submit' className='bg-green-700 h-8 w-16'/>
            </form>
        </div>
    );
}
