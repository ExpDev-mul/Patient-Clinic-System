import { cookies } from 'next/headers'; // for accessing cookies
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Clinic from '@/app/models/Clinic';
import User from '@/app/models/User';
import AdminForm from '../components/AdminForm';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function DashboardPage() {
  // Get cookies from the request
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken'); // Retrieving the 'authToken' from cookies

  if (!authToken) {
    return (
      <div>
        <h1>You are not logged in. Please login first.</h1>
      </div>
    );
  }

  let clinicId = null;

  try {
    // Decode the JWT token
    const decoded = jwt.verify(authToken.value, JWT_SECRET); // Decode using the 'authToken'
    const { email } = decoded;

    // Fetch the physician data
    const user = await User.findOne({ email });

    if (!user) {
      return (
        <div>
          <h1>User not found. Please check your credentials.</h1>
        </div>
      );
    }

    const userId = user._id.toString();

    clinicId = user.clinicId;

    // Fetch the clinic data
    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return (
        <div>
          <h1>Clinic not found. Please check the clinic association.</h1>
        </div>
      );
    }

    const admins = clinic.admins;

    const isAdmin = admins.includes( user._id.toString() )

    console.log( clinic.patients[0].doctorId )

    // Render the dashboard
    return (
      <div className='p-5'>
        <h1 className='font-extrabold text-xl'>Welcome to the Dashboard, {user.name}</h1>
        <h3>Assigned Clinic: {clinic.name}</h3>

        {
          isAdmin ? <>
            <h2 className='mt-10 font-bold'>Admin Controls</h2>
            <button className='bg-gray-900 px-4 py-3 mt-2 rounded-md mx-auto hover:cursor-pointer'>Book Appointment</button>
            <AdminForm clinicId={clinicId}/>
          </> : <></>
        }

        <h2 className='mt-10 font-bold'>Patients Overview</h2>
        <ul className='mt-3 space-y-2'>
          {
            clinic.patients.map((patient, index) => (
              patient.doctorId != userId ? <p>Not your patient.</p> :
              <li key={index} className='p-5 bg-gray-900 rounded-md'>
                <h1 className='font-bold'>{patient.name} ({patient.age} years old)</h1>
                <p>{patient.medicalSummary}</p>
              </li>
            )) 
          }
        </ul>
      </div>
    );
  } catch (error) {
    console.error( error )
    return (
      <div>
        <h1>Error: Invalid or expired token. Please log in again.</h1>
      </div>
    );
  }
}