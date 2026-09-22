const {
    getAllCategories,
    getCategoryById,
    createCategory
} = require('../models/categoryModel');


// ========================================
// GET ALL CATEGORIES
// ========================================

const getCategories = async (req, res) => {

    try {

        const categories =
            await getAllCategories();

        res.status(200).json({
            categories
        });

    } catch (error) {

        console.error(
            'Get categories error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET CATEGORY
// ========================================

const getCategory = async (req, res) => {

    try {

        const categoryId =
            req.params.categoryId;

        const category =
            await getCategoryById(
                categoryId
            );

        if (!category) {

            return res.status(404).json({
                message: 'Category not found'
            });
        }

        res.status(200).json({
            category
        });

    } catch (error) {

        console.error(
            'Get category error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// CREATE CATEGORY
// ========================================

const addCategory = async (req, res) => {

    try {

        const {
            categoryName,
            description
        } = req.body;


        if (!categoryName) {

            return res.status(400).json({
                message: 'Category name is required'
            });
        }


        const categoryId =
            await createCategory(
                categoryName,
                description
            );


        res.status(201).json({

            message:
                'Category created successfully',

            categoryId

        });

    } catch (error) {

        console.error(
            'Create category error:',
            error
        );

        // Duplicate category
        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({
                message:
                    'Category already exists'
            });
        }

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    getCategories,
    getCategory,
    addCategory
};