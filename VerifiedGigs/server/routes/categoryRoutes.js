const express = require('express');

const {
    authenticateToken
} = require('../middleware/authMiddleware');

const {
    getCategories,
    getCategory,
    addCategory
} = require('../controllers/categoryController');

const router = express.Router();


// Get all categories
router.get(
    '/categories',
    authenticateToken,
    getCategories
);


// Get one category
router.get(
    '/categories/:categoryId',
    authenticateToken,
    getCategory
);


// Create category
router.post(
    '/categories',
    authenticateToken,
    addCategory
);


module.exports = router;