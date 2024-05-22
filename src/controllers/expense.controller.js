import { asyncHandler } from "../utils/asyncHandler.js";
import { Expense } from "../models/expense.model.js";
import {Category} from '../models/category.model.js'
import {apiError} from '../utils/apiError.js'
import {apiResponse} from '../utils/apiResponse.js'



const addNewExpense = asyncHandler(async (req, res, next) => {
    const {category, description, amount, expenseDate} = req.body;
    if([category, description, expenseDate].some(el => el === '')) return next(new apiError(400, 'all fields are required'));
    if(!amount) return next(new apiError(400, 'expense amount is required'));
    console.log(category)

    const existingCategory = await Category.findOne({name:category});
    if(!existingCategory) return next(new apiError(404, 'category not exist for current expense. please add category at /categories/add-category'));

    const expense = await Expense.create({
        category: existingCategory._id,
        user: req.user._id,
        description,
        amount,
        expenseDate
    });

    if(!expense) return next(new apiError(500, 'something went wrong while adding expense. try again later'));

    res.status(201).json(new apiResponse(201, expense, 'expense added successfully'))
})
const updateExpense = asyncHandler(async (req, res, next) => {
    if(req.body.category) return next(new apiError(400, 'you can not update category'));
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if(!expense) return next(new apiError(404, 'no expense found for that ID'));

    res.status(200).json(new apiResponse(200, expense, 'expense updated successfully'))
})
const deleteExpense = asyncHandler(async (req, res, next) => {
    const result = await Expense.findByIdAndDelete(req.params.id);

    if(!result) return next(new apiError(404, 'no expense found for that ID'));

    res.status(200).json(new apiResponse(200, {}, 'expense deleted successfully'))
})
const getExpense = asyncHandler(async (req, res, next) => {
    const expense = await Expense.findById(req.params.id)

    if(!expense) return next(new apiError(404, 'no expense found for that ID'));

    res.status(200).json(new apiResponse(200, expense, 'expense fetched successfully'))
})

const getAllExpenses = asyncHandler(async (req, res, next) => {
    const {startDate, endDate} = req.params;
    const filter = {};
    if(req.params.categoryId) filter.category = req.params.categoryId;

    let expenses;
    if(req.params.categoryId){
        expenses = await Expense.find(filter)
    }else if(startDate && endDate){
        expenses = await Expense.find({
            user: req.user._id,
            expenseDate: {$gte: new Date(startDate), $lte: new Date(endDate)}
        }).sort({expenseDate: -1})
    }else{
        let currentDate = new Date();
        const pastWeekDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        const pastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        const past3monthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
        expenses = await Expense.find({
            user: req.user._id,
            expenseDate: {
                $gte: req.query.filter === 'pastWeek'?pastWeekDate:
                req.query.filter === 'pastMonth' ? pastMonthDate:
                req.query.filter === 'past3Months'? past3monthDate:
                new Date('1970-01-01')
            }
        }).sort({expenseDate: -1})
    }

    res.status(200).json(new apiResponse(200, {results: expenses.length, expenses}, 'all expenses fetched successfully'))
})

export {addNewExpense, updateExpense, deleteExpense, getExpense, getAllExpenses}