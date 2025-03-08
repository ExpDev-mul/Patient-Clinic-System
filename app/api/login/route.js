import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

import connectToDatabase from '@/app/lib/mongo';
import User from '@/app/models/User';

const JWT_KEY = process.env.JWT_SECRET

export async function POST(req){
    try { 
        await connectToDatabase()
        const body = await req.json(); // Convert the request body into a dictionary

        const { email, password } = body;

        console.log( `Processing request with email: ${email} and password: ${password}` )
        
        const user = await User.findOne({ email: email })
        if (!user){
            return new Response( JSON.stringify({
                message: 'User with this email does not exist.',
            }), { status: 404 } )
        }

        // We would obviously use bcrypt in a real life scenario!
        const isPassword = (password === user.password)

        if (!isPassword){
            return new Response( JSON.stringify({
                message: 'Password is incorrect.'
            }), { status: 401 } )
        }

        // Tokenize login metadata
        const token = jwt.sign({ email: email, password: password }, JWT_KEY, { algorithm: 'HS256', expiresIn: '1d' })

        const cookie = serialize('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60, // 1 day
            path: '/',
        });

        return new Response( JSON.stringify({
            message: 'Login succesful!',
        }), { status: 200, headers: { 'Set-Cookie': cookie }, } )
    } catch (error) {
        return new Response( JSON.stringify({ error: 'Invalid request.' }), { status: 400 } );
    }
}