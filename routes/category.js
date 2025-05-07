import express from 'express';
import { fetchCategorys } from '../controllers/category.js';
import { verifyUser } from '../middleware/verifyUser.js';
const router = express.Router();

router.route('/fetch').get(verifyUser, fetchCategorys);

export default router;