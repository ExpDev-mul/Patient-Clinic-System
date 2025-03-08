import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    medicalSummary: { type: String, required: false },
    doctorId: { type: String, required: true }
}, { id: false })

const ClinicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admins: [{ type: String, required: true }],
    patients: [ PatientSchema ]
}, { collection: 'Clinics' });

export default mongoose.models.Clinic || mongoose.model('Clinic', ClinicSchema);