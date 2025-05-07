import express from 'express';
import { verifyUser } from '../middleware/verifyUser.js';
import { addSalary, editSalary, getSalaryDetails, getSalaryEditPermission } from '../controllers/dashboard.js';

const router = express.Router();

router.route('/salary/add').post(verifyUser, addSalary);
router.route('/salary/edit').post(verifyUser, editSalary); // Assuming editSalary is the same as addSalary for now
router.route('/salary/edit-permission').get(verifyUser, getSalaryEditPermission);
router.route('/salary/get').get(verifyUser, getSalaryDetails);


export default router;