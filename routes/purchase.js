import express from 'express';
import { verifyUser } from '../middleware/verifyUser.js';
import { addPurchaseValidation } from '../validation/purchase.js';
import { addPurchase, deletePurchase, editPurchase, getPurchase } from '../controllers/purchase.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.route('/add')
    .post(verifyUser, addPurchaseValidation, validateRequest, addPurchase); // Adding purchase with validation

router.route('/get')
    .get(verifyUser, getPurchase); // Getting purchase details

router.route('/delete')
    .delete(verifyUser, deletePurchase); // Deleting purchase

router.route('/edit')
    .put(verifyUser, editPurchase); // Editing purchase


export default router;