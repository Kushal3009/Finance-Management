import { sequelize } from "../config/dbConnection.js";
import logger from "../logger/logger.js";


export const executeQuery = async (query, options = {}) => {
    try {
        const result = await sequelize.query(query, options);
        return result[0];
    } catch (error) {
        logger.error(`Error executing query: ${error.message}`, { stack: error.stack });
        throw new Error('Database query execution failed.');
    }
}