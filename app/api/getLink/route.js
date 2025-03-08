import connectToDatabase from '@/app/lib/mongo';

import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

import User from '@/app/models/User';

const JWT_KEY = process.env.JWT_SECRET

export async function POST(req){
    try { 
        const body = await req.json(); // Convert the request body into a dictionary

        const clinicId = body.clinicId
        const name = body.name
        const age = body.age
        
        console.log( body )

        await connectToDatabase()

        const clinic = await User.findOne({ clinicId: clinicId })
        if (!clinic){
            return new Response( JSON.stringify({
                message: 'Clinic with this id does not exist.',
            }), { status: 404 } )
        }
        
        const token = jwt.sign({ 
            clinicId: clinicId,
            name: name,
            age: age
         }, JWT_KEY, { algorithm: 'HS256', expiresIn: '15m' })

         return new Response( JSON.stringify({ token: token }), { status: 200 } )
    } catch (error) {
        return new Response( JSON.stringify({ error: 'Invalid request.' }), { status: 400 } );
    }
}