import { sequelize } from "../config/dbConnection.js";
import logger from "../logger/logger.js";
import { salarySchema } from "../models/salary.js";
import { Op, fn, col, where } from 'sequelize';

export const addSalary = async (req, res) => {
    logger.info(`addSalary called ${req.user?.id}`);
    const transaction = await sequelize.transaction();
    try {
        const { salary } = req.body;
        const { id } = req.user;
        if (!salary || !id) {
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'purchaseId is required',
            });
        }

        await salarySchema.create({
            userId: id,
            total_balance: salary
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: 'Salary added successfully',
            data: ""
        })
    } catch (error) {
        await transaction.rollback();
        logger.error(`Error adding salary: ${error.message}`, { stack: error.stack });
        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const editSalary = async (req, res) => {
    logger.info('editSalary called', { user: req.user?.id });
    const transaction = await sequelize.transaction();

    try {
        const { salary } = req.body;

        if (!salary) {
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'Salary is required',
            });
        }

        const { id } = req.user;

        // 1. Find existing salary record
        const existingSalary = await salarySchema.findOne({ where: { userId: id }, transaction });

        if (!existingSalary) {
            return res.status(404).json({
                statusCode: 404,
                status: false,
                message: 'Salary record not found',
            });
        }

        // 2. Update salary
        await existingSalary.update(
            { total_balance: salary },
            { transaction }
        );

        await transaction.commit();

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: 'Salary Update successfully',
            data: ""
        })

    } catch (error) {
        await transaction.rollback();
        logger.error(`Error updating salary: ${error.message}`, { stack: error.stack });
        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getSalaryEditPermission = async (req, res) => {
    logger.info('getSalaryEditPermission called', { user: req.user?.id });
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'User ID is required',
            });
        }

        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const existingSalary = await salarySchema.findOne({
            where: {
                userId: id,
                [Op.and]: [
                    where(fn('MONTH', col('createdAt')), month),
                    where(fn('YEAR', col('createdAt')), year),
                ]
            }
        });

        if (existingSalary) {
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                data: { editAccess: true },
                message: 'User can edit salary for current month.',
            });
        } else {
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                data: { editAccess: false },
                message: 'User cannot edit salary for current month.'
            });
        }
    } catch (error) {
        logger.error(`Error checking salary edit permission: ${error.message}`, { stack: error.stack });
        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


export const getSalaryDetails = async (req, res) => {
    logger.info('getSalaryDetails called', { user: req.user?.id });
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'User ID is required',
            });
        }

        logger.info(`Fetching salary details for user ID: ${id}`);
        const salaryDetails = await salarySchema.findAll({
            where: {
                userId: id
            }
        });



        const query = `sp_CalculateCategoryWiseSpending ?`

        const categoryDetails = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.SELECT
        })


        if (salaryDetails.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                message: 'No Salary Details Found',
                data: ""
            });
        }


        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: {
                salaryDetails: salaryDetails,
                categoryDetails: categoryDetails
            },
            message: 'Salary details retrieved successfully.',
        });
    } catch (error) {
        logger.error(`Error retrieving salary details: ${error.message} `, { stack: error.stack });
        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}