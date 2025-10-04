import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../logger/logger.js';

dotenv.config();

const DB_DIALECT = process.env.DB_DIALECT || 'mssql';


// Initialize Sequelize with MSSQL configuration
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: DB_DIALECT || 'mssql',
    logging: false,
});

// Test the database connection
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info(`Connection to ${DB_DIALECT} has been established successfully.`);
    } catch (error) {
        console.log(error)
        logger.error('Unable to connect to the database:', error);
    }
}

