import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI; // Store the MongoDB URI here
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase() {
    if (mongoose.connections[0].readyState) {
        return; // Reuse the connection if it's already established
    }

    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export default connectToDatabase;