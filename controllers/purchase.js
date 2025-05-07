import moment from "moment";
import { sequelize } from "../config/dbConnection.js"
import logger from "../logger/logger.js";
import { purchase } from "../models/purchase.js";
import { executeQuery } from "../services/dbOperation.js";
import { TOP_PURCHASES, PURCHASES } from "../config/constant.js";


export const addPurchase = async (req, res) => {
    let transaction;
    try {
        const userId = req.user.id;
        const { categoryId, purchaseName, date, price, paymentType } = req.body;


        transaction = await sequelize.transaction();

        await purchase.create(
            { userId, categoryId, purchaseName, date: date, price, paymentType },
            { transaction }
        );

        await sequelize.query('sp_modifySalaryStructrue ?', {
            replacements: [userId],
            transaction: transaction
        })

        await transaction.commit();
        logger.info('addPurchase: committed transaction', { userId });

        return res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Purchase Added Successfully',
            data: ''
        });
    } catch (error) {
        logger.error('addPurchase: error occurred', { message: error.message, stack: error.stack });
        if (transaction) await transaction.rollback();
        logger.info('addPurchase: rolled back transaction', { user: req.user.id });

        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

export const getPurchase = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { type } = req.query;
        const userId = req.user.id;
        const options = {
            replacements: [userId],
            transaction: transaction ? transaction : null
        }
        let purchases;

        if (type !== 'dashboard' && type !== 'transection') {
            await transaction.rollback();
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'Invalid type query parameter',
            });
        }

        if (type === "dashboard") {
            purchases = await executeQuery(TOP_PURCHASES, options)
        } else if (type === "transection") {
            purchases = await executeQuery(PURCHASES, options)
        }

        const formattedPurchases = purchases.map(p => {
            return {
                ...p,
                date: moment(p.date).format('DD-MMM-YYYY')
            };
        });


        await transaction.commit();
        return res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Purchase Retrieved Successfully',
            data: formattedPurchases,
        });
    } catch (error) {
        logger.error('getPurchase: error occurred', { message: error.message, stack: error.stack });
        await transaction.rollback();
        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

export const editPurchase = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { purchaseId } = req.query;
        const { categoryId, purchaseName, date, price, paymentType } = req.body;
        const { id } = req.user;


        if (!purchaseId) {
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'purchaseId is required'
            });
        }

        await purchase.update(
            { categoryId, purchaseName, date, price, paymentType },
            {
                where: { id: purchaseId },
                transaction
            }
        );
        await sequelize.query('sp_modifySalaryStructrue ?', {
            replacements: [id],
            transaction: transaction
        })

        await transaction.commit();
        return res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Purchase updated successfully',
            data: ''
        });
    } catch (error) {
        logger.error('editPurchase: error occurred', { message: error.message, stack: error.stack });
        if (transaction) await transaction.rollback();
        logger.info('editPurchase: rolled back transaction', { user: req.user.id });

        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

export const deletePurchase = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { purchaseId } = req.query;
        const { id } = req.user;

        if (!purchaseId) {
            return res.status(400).json({
                statusCode: 400,
                status: false,
                message: 'purchaseId is required',
            });
        }

        const deleted = await purchase.destroy({
            where: { id: purchaseId },
            transaction,
        });

        await sequelize.query('sp_modifySalaryStructrue ?', {
            replacements: [id],
            transaction: transaction
        })

        if (deleted === 0) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: false,
                message: 'Purchase not found',
            });
        }

        await transaction.commit();
        return res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Purchase deleted successfully',
            data: '',
        });
    } catch (error) {
        logger.error('deletePurchase: error occurred', { message: error.message, stack: error.stack });
        if (transaction) await transaction.rollback();
        logger.info('deletePurchase: rolled back transaction', { user: req.user.id });

        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
