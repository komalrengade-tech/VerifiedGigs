const pool = require('../config/db');


// ========================================
// GET ALL CATEGORIES
// ========================================

const getAllCategories = async () => {

    const [rows] = await pool.query(
        `SELECT
            category_id,
            category_name,
            description
         FROM gig_categories
         ORDER BY category_name`
    );

    return rows;
};


// ========================================
// GET CATEGORY BY ID
// ========================================

const getCategoryById = async (categoryId) => {

    const [rows] = await pool.query(
        `SELECT
            category_id,
            category_name,
            description
         FROM gig_categories
         WHERE category_id = ?`,
        [categoryId]
    );

    return rows[0];
};


// ========================================
// CREATE CATEGORY
// ========================================

const createCategory = async (
    categoryName,
    description
) => {

    const [result] = await pool.query(
        `INSERT INTO gig_categories
        (
            category_name,
            description
        )
        VALUES (?, ?)`,
        [
            categoryName,
            description || null
        ]
    );

    return result.insertId;
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory
};