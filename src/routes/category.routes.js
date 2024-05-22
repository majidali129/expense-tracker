
import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import { addNewCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../controllers/category.controller.js';
import expenseRouter from '../routes/expense.routes.js'

const router = express.Router()

router.use('/:categoryId/expenses', expenseRouter)

router.route('/').get(protectRoute, getAllCategories);
router.route('/add-category').post(protectRoute, addNewCategory);
router.route('/:id')
.get(protectRoute, getCategory)
.delete(protectRoute, deleteCategory)
.patch(protectRoute, updateCategory);

export default router;