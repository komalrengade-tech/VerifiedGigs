const pool = require('../config/db');


// ========================================
// CHECK IF REVIEW ALREADY EXISTS
// ========================================

const checkExistingReview = async (
    projectId,
    reviewerUserId,
    reviewedUserId
) => {

    const [rows] = await pool.query(
        `SELECT review_id
         FROM reviews
         WHERE project_id = ?
         AND reviewer_user_id = ?
         AND reviewed_user_id = ?`,
        [
            projectId,
            reviewerUserId,
            reviewedUserId
        ]
    );

    return rows[0];
};


// ========================================
// CREATE REVIEW
// ========================================

const createReview = async (
    projectId,
    reviewerUserId,
    reviewedUserId,
    rating,
    reviewText
) => {

    const [result] = await pool.query(
        `INSERT INTO reviews
        (
            project_id,
            reviewer_user_id,
            reviewed_user_id,
            rating,
            review_text
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            projectId,
            reviewerUserId,
            reviewedUserId,
            rating,
            reviewText
        ]
    );

    return result.insertId;
};


// ========================================
// GET PROJECT REVIEWS
// ========================================

const getProjectReviews = async (projectId) => {

    const [rows] = await pool.query(
        `SELECT
            r.review_id,
            r.project_id,
            r.reviewer_user_id,
            reviewer.name AS reviewer_name,
            r.reviewed_user_id,
            reviewed.name AS reviewed_name,
            r.rating,
            r.review_text,
            r.created_at
         FROM reviews r

         INNER JOIN users reviewer
             ON r.reviewer_user_id = reviewer.user_id

         INNER JOIN users reviewed
             ON r.reviewed_user_id = reviewed.user_id

         WHERE r.project_id = ?

         ORDER BY r.created_at DESC`,
        [projectId]
    );

    return rows;
};


// ========================================
// GET USER REVIEWS
// ========================================

const getUserReviews = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            r.review_id,
            r.project_id,
            r.reviewer_user_id,
            reviewer.name AS reviewer_name,
            r.rating,
            r.review_text,
            r.created_at
         FROM reviews r

         INNER JOIN users reviewer
             ON r.reviewer_user_id = reviewer.user_id

         WHERE r.reviewed_user_id = ?

         ORDER BY r.created_at DESC`,
        [userId]
    );

    return rows;
};


module.exports = {
    checkExistingReview,
    createReview,
    getProjectReviews,
    getUserReviews
};