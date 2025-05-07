import { body } from 'express-validator';

export const addPurchaseValidation = [
    body('categoryId')
        .notEmpty()
        .withMessage('Category ID is required'),
    body('purchaseName')
        .notEmpty()
        .withMessage('Purchase name is required'),
    body('date')
        .notEmpty()
        .withMessage('Date is required'),
    body('price')
        .notEmpty()
        .withMessage('Price is required'),
]