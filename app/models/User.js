import mongoose from 'mongoose';

import { ClinicSchema } from './Clinic'

const UserSchema = new mongoose.Schema({
    name: { type: String, requried: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    clinicId: { type: String, required: true }
}, { collection: 'Users' });

export default mongoose.models.User || mongoose.model('User', UserSchema);