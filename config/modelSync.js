import logger from "../logger/logger.js";
import { category } from "../models/category.js";
import { purchase } from "../models/purchase.js";
import { salarySchema } from "../models/salary.js";

export const modelSync = async () => {
    try {
        // await category.sync({ alter: true });
        // await purchase.sync({ alter: true });
        // await salarySchema.sync({ alter: true });
        logger.info('Model sync executed successfully.');
    } catch (error) {
        logger.error('Error during model sync:', error);
    }
}