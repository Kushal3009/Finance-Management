import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/dbConnection.js';
import { modelSync } from './config/modelSync.js';
import logger from './logger/logger.js';
import { morganMiddleware } from './middleware/morgan.js';
import category from './routes/category.js';
import purchase from './routes/purchase.js';
import dashboard from './routes/dashboard.js';

dotenv.config();

await connectDB();
await modelSync();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIXED CORS CONFIG
const allowedOrigins = [
    'https://finace-tracker-frontend-f3l9.vercel.app',
    'http://localhost:3000',
];

// Use dynamic origin checking (Render sometimes changes domains)
app.use(cors({
    origin: true,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.use('/api/category', category);
app.use('/api/purchase', purchase);
app.use('/api/dashboard', dashboard);

app.listen(PORT, () => {
    logger.info(`✅ Server running on port ${PORT}`);
});
