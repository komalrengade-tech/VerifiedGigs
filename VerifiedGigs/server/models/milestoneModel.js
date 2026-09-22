const pool = require('../config/db');


// ========================================
// CREATE MILESTONE
// ========================================

const createMilestone = async (
    projectId,
    title,
    description,
    amount,
    dueDate
) => {

    const [result] = await pool.query(
        `INSERT INTO project_milestone
        (
            project_id,
            title,
            description,
            amount,
            due_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, 'PENDING')`,
        [
            projectId,
            title,
            description,
            amount,
            dueDate
        ]
    );

    return result.insertId;
};


// ========================================
// GET PROJECT MILESTONES
// ========================================

const getProjectMilestones = async (projectId) => {

    const [rows] = await pool.query(
        `SELECT
            milestone_id,
            project_id,
            title,
            description,
            amount,
            due_date,
            completion_date,
            status
         FROM project_milestone
         WHERE project_id = ?
         ORDER BY due_date ASC`,
        [projectId]
    );

    return rows;
};


// ========================================
// GET SINGLE MILESTONE
// ========================================

const getMilestoneById = async (milestoneId) => {

    const [rows] = await pool.query(
        `SELECT
            milestone_id,
            project_id,
            title,
            description,
            amount,
            due_date,
            completion_date,
            status
         FROM project_milestone
         WHERE milestone_id = ?`,
        [milestoneId]
    );

    return rows[0];
};


// ========================================
// UPDATE MILESTONE
// ========================================

const updateMilestone = async (
    milestoneId,
    title,
    description,
    amount,
    dueDate
) => {

    const [result] = await pool.query(
        `UPDATE project_milestone
         SET title = ?,
             description = ?,
             amount = ?,
             due_date = ?
         WHERE milestone_id = ?`,
        [
            title,
            description,
            amount,
            dueDate,
            milestoneId
        ]
    );

    return result.affectedRows;
};


// ========================================
// COMPLETE MILESTONE
// ========================================

const completeMilestone = async (milestoneId) => {

    const [result] = await pool.query(
        `UPDATE project_milestone
         SET status = 'COMPLETED',
             completion_date = CURRENT_DATE
         WHERE milestone_id = ?`,
        [milestoneId]
    );

    return result.affectedRows;
};


// ========================================
// DELETE MILESTONE
// ========================================

const deleteMilestone = async (milestoneId) => {

    const [result] = await pool.query(
        `DELETE FROM project_milestone
         WHERE milestone_id = ?`,
        [milestoneId]
    );

    return result.affectedRows;
};


module.exports = {
    createMilestone,
    getProjectMilestones,
    getMilestoneById,
    updateMilestone,
    completeMilestone,
    deleteMilestone
};