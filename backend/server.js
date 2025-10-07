import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import habitRoutes from './routes/habits.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/habits', habitRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Habit Tracker API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});