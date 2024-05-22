
import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import {addNewExpense, deleteExpense, getAllExpenses, getExpense, updateExpense} from '../controllers/expense.controller.js'

const router = express.Router({mergeParams: true})


router.route('/').get(protectRoute, getAllExpenses);
router.route('/add-expense').post(protectRoute, addNewExpense);
router.route('/:id')
.get(protectRoute, getExpense)
.delete(protectRoute, deleteExpense)
.patch(protectRoute, updateExpense);

export default router;