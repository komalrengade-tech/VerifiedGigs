const pool = require('../config/db');


// ======================================================
// GET ALL OPEN GIGS
// ======================================================

const getAllGigs = async () => {

    const [rows] = await pool.query(

        `SELECT
            g.gig_id,
            g.client_id,
            g.category_id,
            g.title,
            g.description,
            g.budget_min,
            g.budget_max,
            g.deadline,
            g.required_experience,
            g.status,
            g.created_at,
            g.updated_at,

            c.company_name,
            c.company_description,
            c.company_website,
            c.location AS company_location,

            gc.category_name

        FROM gigs g

        INNER JOIN clients c
            ON g.client_id = c.client_id

        INNER JOIN gig_categories gc
            ON g.category_id = gc.category_id

        WHERE g.status = 'OPEN'

        ORDER BY g.created_at DESC`

    );

    return rows;
};


// ======================================================
// GET ONE GIG BY ID
// ======================================================

const getGigById = async (gigId) => {

    const [rows] = await pool.query(

        `SELECT
            g.gig_id,
            g.client_id,
            g.category_id,
            g.title,
            g.description,
            g.budget_min,
            g.budget_max,
            g.deadline,
            g.required_experience,
            g.status,
            g.created_at,
            g.updated_at,

            c.company_name,
            c.company_description,
            c.company_website,
            c.location AS company_location,

            gc.category_name

        FROM gigs g

        INNER JOIN clients c
            ON g.client_id = c.client_id

        INNER JOIN gig_categories gc
            ON g.category_id = gc.category_id

        WHERE g.gig_id = ?`,
        [gigId]

    );

    return rows[0];
};


// ======================================================
// GET ALL GIGS — ADMIN (ANY STATUS)
// ======================================================

const getAllGigsAdmin = async () => {

    const [rows] = await pool.query(

        `SELECT
            g.gig_id,
            g.client_id,
            g.category_id,
            g.title,
            g.description,
            g.budget_min,
            g.budget_max,
            g.deadline,
            g.required_experience,
            g.status,
            g.created_at,
            g.updated_at,

            c.company_name,
            c.company_description,
            c.company_website,
            c.location AS company_location,

            gc.category_name

        FROM gigs g

        INNER JOIN clients c
            ON g.client_id = c.client_id

        INNER JOIN gig_categories gc
            ON g.category_id = gc.category_id

        ORDER BY g.created_at DESC`

    );

    return rows;
};


// ======================================================
// DELETE GIG — ADMIN (ANY OWNER)
// ======================================================

const deleteGigAdmin = async (gigId) => {

    const [result] = await pool.query(

        `DELETE FROM gigs

        WHERE gig_id = ?`,

        [gigId]

    );

    return result;
};


// ======================================================
// GET CLIENT ID USING USER ID
// ======================================================

const getClientIdByUserId = async (userId) => {

    const [rows] = await pool.query(

        `SELECT
            client_id

        FROM clients

        WHERE user_id = ?`,
        [userId]

    );

    return rows[0];
};


// ======================================================
// CREATE GIG
// ======================================================

const createGig = async (
    clientId,
    categoryId,
    title,
    description,
    budgetMin,
    budgetMax,
    deadline,
    requiredExperience
) => {

    const [result] = await pool.query(

        `INSERT INTO gigs
        (
            client_id,
            category_id,
            title,
            description,
            budget_min,
            budget_max,
            deadline,
            required_experience
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        
        [
            clientId,
            categoryId,
            title,
            description,
            budgetMin,
            budgetMax,
            deadline,
            requiredExperience
        ]

    );

    return result;
};


// ======================================================
// UPDATE GIG
// ======================================================

const updateGig = async (
    gigId,
    clientId,
    categoryId,
    title,
    description,
    budgetMin,
    budgetMax,
    deadline,
    requiredExperience,
    status
) => {

    const [result] = await pool.query(

        `UPDATE gigs

        SET
            category_id = ?,
            title = ?,
            description = ?,
            budget_min = ?,
            budget_max = ?,
            deadline = ?,
            required_experience = ?,
            status = ?

        WHERE gig_id = ?

        AND client_id = ?`,

        [
            categoryId,
            title,
            description,
            budgetMin,
            budgetMax,
            deadline,
            requiredExperience,
            status,
            gigId,
            clientId
        ]

    );

    return result;
};


// ======================================================
// DELETE GIG
// ======================================================

const deleteGig = async (gigId, clientId) => {

    const [result] = await pool.query(

        `DELETE FROM gigs

        WHERE gig_id = ?

        AND client_id = ?`,

        [
            gigId,
            clientId
        ]

    );

    return result;
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getAllGigs,
    getAllGigsAdmin,
    getGigById,
    getClientIdByUserId,
    createGig,
    updateGig,
    deleteGig,
    deleteGigAdmin

};