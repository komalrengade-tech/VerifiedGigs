const pool = require('../config/db');


// ========================================
// ADD FAVORITE
// ========================================

const addFavorite = async (studentId, gigId) => {

    const [result] = await pool.query(
        `INSERT INTO favorite_gig
        (
            student_id,
            gig_id
        )
        VALUES (?, ?)`,
        [
            studentId,
            gigId
        ]
    );

    return result;
};


// ========================================
// REMOVE FAVORITE
// ========================================

const removeFavorite = async (
    studentId,
    gigId
) => {

    const [result] = await pool.query(
        `DELETE FROM favorite_gig
         WHERE student_id = ?
         AND gig_id = ?`,
        [
            studentId,
            gigId
        ]
    );

    return result.affectedRows;
};


// ========================================
// GET STUDENT FAVORITES
// ========================================

const getStudentFavorites = async (
    studentId
) => {

    const [rows] = await pool.query(
        `SELECT
            fg.student_id,
            fg.gig_id,
            fg.saved_at,

            g.title,
            g.description,
            g.budget,
            g.status,

            c.client_id,
            c.company_name

         FROM favorite_gig fg

         INNER JOIN gigs g
             ON fg.gig_id = g.gig_id

         INNER JOIN clients c
             ON g.client_id = c.client_id

         WHERE fg.student_id = ?

         ORDER BY fg.saved_at DESC`,
        [studentId]
    );

    return rows;
};


// ========================================
// CHECK FAVORITE
// ========================================

const checkFavorite = async (
    studentId,
    gigId
) => {

    const [rows] = await pool.query(
        `SELECT
            student_id,
            gig_id
         FROM favorite_gig
         WHERE student_id = ?
         AND gig_id = ?`,
        [
            studentId,
            gigId
        ]
    );

    return rows[0];
};


module.exports = {
    addFavorite,
    removeFavorite,
    getStudentFavorites,
    checkFavorite
};