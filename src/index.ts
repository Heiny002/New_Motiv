import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from '../config/database';
import { authenticateUser } from './middleware/auth';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Test protected route
app.get('/api/protected', authenticateUser, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes will be added here

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 