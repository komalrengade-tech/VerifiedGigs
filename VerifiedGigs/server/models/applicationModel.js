const pool = require('../config/db');


// ======================================================
// GET STUDENT ID USING USER ID
// ======================================================

const getStudentIdByUserId = async (userId) => {

    const [rows] = await pool.query(
        `SELECT student_id
         FROM students
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};


// ======================================================
// CHECK WHETHER STUDENT ALREADY APPLIED
// ======================================================

const checkExistingApplication = async (
    gigId,
    studentId
) => {

    const [rows] = await pool.query(
        `SELECT application_id
         FROM applications
         WHERE gig_id = ?
         AND student_id = ?`,
        [
            gigId,
            studentId
        ]
    );

    return rows[0];
};


// ======================================================
// CREATE APPLICATION
// ======================================================

const createApplication = async (
    gigId,
    studentId,
    coverLetter,
    proposedPrice,
    estimatedDays
) => {

    const [result] = await pool.query(
        `INSERT INTO applications
        (
            gig_id,
            student_id,
            cover_letter,
            proposed_price,
            estimated_days
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            gigId,
            studentId,
            coverLetter,
            proposedPrice,
            estimatedDays
        ]
    );

    return result;
};


// ======================================================
// GET STUDENT APPLICATIONS
// ======================================================

const getStudentApplications = async (
    studentId
) => {

    const [rows] = await pool.query(

        `SELECT
            a.application_id,
            a.gig_id,
            a.student_id,
            a.cover_letter,
            a.proposed_price,
            a.estimated_days,
            a.application_status,
            a.applied_at,
            a.reviewed_at,

            g.title AS gig_title,
            g.description AS gig_description,
            g.budget_min,
            g.budget_max,
            g.deadline,
            g.status AS gig_status,

            c.client_id,
            c.company_name,

            gc.category_name

        FROM applications a

        INNER JOIN gigs g
            ON a.gig_id = g.gig_id

        INNER JOIN clients c
            ON g.client_id = c.client_id

        INNER JOIN gig_categories gc
            ON g.category_id = gc.category_id

        WHERE a.student_id = ?

        ORDER BY a.applied_at DESC`,

        [studentId]
    );

    return rows;
};


// ======================================================
// GET SINGLE STUDENT APPLICATION
// ======================================================

const getStudentApplicationById = async (
    applicationId,
    studentId
) => {

    const [rows] = await pool.query(

        `SELECT
            a.application_id,
            a.gig_id,
            a.student_id,
            a.cover_letter,
            a.proposed_price,
            a.estimated_days,
            a.application_status,
            a.applied_at,
            a.reviewed_at,

            g.title AS gig_title,
            g.description AS gig_description,
            g.budget_min,
            g.budget_max,
            g.deadline,
            g.status AS gig_status,

            c.client_id,
            c.company_name,

            gc.category_name

        FROM applications a

        INNER JOIN gigs g
            ON a.gig_id = g.gig_id

        INNER JOIN clients c
            ON g.client_id = c.client_id

        INNER JOIN gig_categories gc
            ON g.category_id = gc.category_id

        WHERE a.application_id = ?
        AND a.student_id = ?`,

        [
            applicationId,
            studentId
        ]
    );

    return rows[0];
};


// ======================================================
// WITHDRAW APPLICATION
// ======================================================

const withdrawApplication = async (
    applicationId,
    studentId
) => {

    const [result] = await pool.query(

        `UPDATE applications

         SET application_status = 'WITHDRAWN'

         WHERE application_id = ?
         AND student_id = ?

         AND application_status IN (
             'PENDING',
             'SHORTLISTED'
         )`,

        [
            applicationId,
            studentId
        ]
    );

    return result;
};


// ======================================================
// GET CLIENT ID USING USER ID
// ======================================================

const getClientIdByUserId = async (
    userId
) => {

    const [rows] = await pool.query(
        `SELECT client_id
         FROM clients
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};


// ======================================================
// GET APPLICATIONS FOR CLIENT'S GIGS
// ======================================================

const getClientApplications = async (
    clientId
) => {

    const [rows] = await pool.query(

        `SELECT
            a.application_id,
            a.gig_id,
            a.student_id,
            a.cover_letter,
            a.proposed_price,
            a.estimated_days,
            a.application_status,
            a.applied_at,
            a.reviewed_at,

            g.title AS gig_title,

            s.college_name,
            s.course,
            s.year_of_study,
            s.bio,
            s.location,

            u.user_id,
            u.name AS student_name,
            u.email AS student_email,
            u.profile_picture

        FROM applications a

        INNER JOIN gigs g
            ON a.gig_id = g.gig_id

        INNER JOIN students s
            ON a.student_id = s.student_id

        INNER JOIN users u
            ON s.user_id = u.user_id

        WHERE g.client_id = ?

        ORDER BY a.applied_at DESC`,

        [clientId]
    );

    return rows;
};


// ======================================================
// GET APPLICATION BY ID FOR CLIENT
// ======================================================

const getClientApplicationById = async (
    applicationId,
    clientId
) => {

    const [rows] = await pool.query(

        `SELECT
            a.application_id,
            a.gig_id,
            a.student_id,
            a.cover_letter,
            a.proposed_price,
            a.estimated_days,
            a.application_status,
            a.applied_at,
            a.reviewed_at,

            g.title AS gig_title,

            s.college_name,
            s.course,
            s.year_of_study,
            s.bio,
            s.location,

            u.user_id,
            u.name AS student_name,
            u.email AS student_email,
            u.profile_picture

        FROM applications a

        INNER JOIN gigs g
            ON a.gig_id = g.gig_id

        INNER JOIN students s
            ON a.student_id = s.student_id

        INNER JOIN users u
            ON s.user_id = u.user_id

        WHERE a.application_id = ?
        AND g.client_id = ?`,

        [
            applicationId,
            clientId
        ]
    );

    return rows[0];
};


// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (
    applicationId,
    clientId,
    status
) => {

    const [result] = await pool.query(

        `UPDATE applications a

         INNER JOIN gigs g
             ON a.gig_id = g.gig_id

         SET
             a.application_status = ?,
             a.reviewed_at = NOW()

         WHERE a.application_id = ?
         AND g.client_id = ?`,

        [
            status,
            applicationId,
            clientId
        ]
    );

    return result;
};


// ======================================================
// GET GIG OWNER'S USER ID + GIG TITLE (FOR NOTIFICATIONS)
// ======================================================

const getGigOwnerByGigId = async (gigId) => {

    const [rows] = await pool.query(
        `SELECT
            u.user_id AS owner_user_id,
            g.title AS gig_title
         FROM gigs g
         INNER JOIN clients c
            ON g.client_id = c.client_id
         INNER JOIN users u
            ON c.user_id = u.user_id
         WHERE g.gig_id = ?`,
        [gigId]
    );

    return rows[0] || null;
};


// ======================================================
// GET APPLICANT'S USER ID + GIG TITLE (FOR NOTIFICATIONS)
// ======================================================

const getApplicantByApplicationId = async (applicationId) => {

    const [rows] = await pool.query(
        `SELECT
            u.user_id AS applicant_user_id,
            g.title AS gig_title
         FROM applications a
         INNER JOIN students s
            ON a.student_id = s.student_id
         INNER JOIN users u
            ON s.user_id = u.user_id
         INNER JOIN gigs g
            ON a.gig_id = g.gig_id
         WHERE a.application_id = ?`,
        [applicationId]
    );

    return rows[0] || null;
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getStudentIdByUserId,
    checkExistingApplication,
    createApplication,
    getStudentApplications,
    getStudentApplicationById,
    withdrawApplication,

    getClientIdByUserId,
    getClientApplications,
    getClientApplicationById,
    updateApplicationStatus,

    getGigOwnerByGigId,
    getApplicantByApplicationId

};