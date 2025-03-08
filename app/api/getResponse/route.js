import jwt from 'jsonwebtoken'

import connectToDatabase from '@/app/lib/mongo';

import Clinic from '@/app/models/Clinic';

const responses = [
    'When did this begin to happen?',
    'Have you previously been assisted with your condition by a medical professional?',
    'How does this condition affect you?'
];

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req){
    try { 
        const body = await req.json(); // Convert the request body into a dictionary

        const current = body.current
        const token = body.token

        if (current < responses.length) {
            const response = responses[current]
            return new Response( JSON.stringify({ content: response }), { status: 200 } );
        } else {
            // Now we should insert the new data into the patient
            await connectToDatabase();

            const decoded = jwt.verify(token, JWT_SECRET)

            const { doctorId, clinicId, name, age } = decoded
            
            const newDescription = 'This patient is barely sick and he just has to get tested, etc.'

            // Find the user by their ID and update their description
            const clinic = await Clinic.updateOne(
                { _id: clinicId },
                { $push: { 
                    patients: {
                        name: name,
                        age: age,
                        medicalSummary: newDescription,
                        doctorId: doctorId
                    }
                 } }, // Update the description field
            );

            if (!clinic) {
                return new Response(JSON.stringify({ error: 'Clinic not found' }), { status: 404 });
            }

            return new Response(JSON.stringify({ 
                content: 'Your data has been sent to your local clinic.' 
            }), { status: 200 });
        }
    } catch (error) {
        return new Response( JSON.stringify({ error: 'Invalid request.' }), { status: 400 } );
    }
}