import { asyncHandler } from '../utils/asyncHandler.js';
import { Category } from '../models/category.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addNewCategory = asyncHandler(async (req, res, next) => {
    if (!req.body.name) return next(new apiError(400, 'category name is required'));

    const existingCat = await Category.findOne({
        name: req.body.name,
    });
    if (existingCat) return next(new apiError(400, 'category already exist'));

    const category = await Category.create(req.body);
    if (!category)
        return next(new apiError(500, 'facing issue while creating new category. try again later'));

    res.status(201).json(new apiResponse(201, category, 'category added successfully'));
});

const updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!category)
        return next(new apiError(404, 'No category exist for that ID'));

    res.status(200).json(new apiResponse(200, category, 'category updated successfully'));
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    const result = await Category.findByIdAndDelete(req.params.id)
    if(!result) return next(new apiError(404, 'category not found for that ID'));

    res.status(200).json(new apiResponse(200, {}, 'category deleted successfully'))
});

const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json(new apiResponse(200, {categories, results: categories.length}, 'all categories fetched'))
});

const getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if(!category) return next(new apiError(404, 'category not found for that ID'));
    res.status(200).json(new apiResponse(200, category , 'category fetched successfully'))
});

export { addNewCategory, updateCategory, deleteCategory, getCategory, getAllCategories };
