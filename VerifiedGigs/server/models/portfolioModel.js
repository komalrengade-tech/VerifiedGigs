const pool = require('../config/db');

// Get student_id using logged-in user's user_id
const getStudentIdByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT student_id
         FROM students
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};


// Create portfolio project
const createPortfolio = async (
    studentId,
    title,
    description,
    projectUrl,
    githubUrl,
    imageUrl
) => {

    const [result] = await pool.query(
        `INSERT INTO portfolios
        (
            student_id,
            title,
            description,
            project_url,
            github_url,
            image_url
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            studentId,
            title,
            description,
            projectUrl,
            githubUrl,
            imageUrl
        ]
    );

    return result.insertId;
};


// Get all portfolio projects of a student
const getStudentPortfolio = async (studentId) => {

    const [rows] = await pool.query(
        `SELECT
            portfolio_id,
            student_id,
            title,
            description,
            project_url,
            github_url,
            image_url,
            created_at
         FROM portfolios
         WHERE student_id = ?
         ORDER BY created_at DESC`,
        [studentId]
    );

    return rows;
};


// Update portfolio project
const updatePortfolio = async (
    portfolioId,
    studentId,
    title,
    description,
    projectUrl,
    githubUrl,
    imageUrl
) => {

    const [result] = await pool.query(
        `UPDATE portfolios
         SET title = ?,
             description = ?,
             project_url = ?,
             github_url = ?,
             image_url = ?
         WHERE portfolio_id = ?
         AND student_id = ?`,
        [
            title,
            description,
            projectUrl,
            githubUrl,
            imageUrl,
            portfolioId,
            studentId
        ]
    );

    return result.affectedRows;
};


// Delete portfolio project
const deletePortfolio = async (
    portfolioId,
    studentId
) => {

    const [result] = await pool.query(
        `DELETE FROM portfolios
         WHERE portfolio_id = ?
         AND student_id = ?`,
        [
            portfolioId,
            studentId
        ]
    );

    return result.affectedRows;
};


module.exports = {
    getStudentIdByUserId,
    createPortfolio,
    getStudentPortfolio,
    updatePortfolio,
    deletePortfolio
};