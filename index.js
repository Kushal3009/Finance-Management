import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { connectDB } from './config/dbConnection.js';
import { modelSync } from './config/modelSync.js';
import logger from './logger/logger.js';
import { morganMiddleware } from './middleware/morgan.js';
import category from './routes/category.js'
import purchase from './routes/purchase.js'
import dashboard from './routes/dashboard.js'


await connectDB();
await modelSync();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'https://finace-tracker-frontend-f3l9.vercel.app', // your Vercel frontend
    'http://localhost:3000', // for local testing
];

// Middleware to parse JSON
app.use(cors({
    origin: true,
    credentials: true, // if you’re using cookies / tokens
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware)
app.use('/api/category', category)
app.use('/api/purchase', purchase)
app.use('/api/dashboard', dashboard)


// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});