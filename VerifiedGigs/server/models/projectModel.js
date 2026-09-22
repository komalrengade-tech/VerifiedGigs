const db = require('../config/db');

// ======================================================
// GET CLIENT ID USING USER ID
// ======================================================
const getClientIdByUserId = async (userId) => {
    const [rows] = await db.query(
        `SELECT client_id
         FROM clients
         WHERE user_id = ?`,
        [userId]
    );

    return rows.length ? rows[0].client_id : null;
};

    const getProjectAccess = async (projectId, userId) => {
        const [rows] = await db.query(
            `SELECT
                p.project_id,
                p.client_id,
                p.student_id,
                p.project_status,
                c.user_id AS client_user_id,
                s.user_id AS student_user_id
             FROM projects p
             INNER JOIN clients c ON p.client_id = c.client_id
             INNER JOIN students s ON p.student_id = s.student_id
             WHERE p.project_id = ?
             AND (c.user_id = ? OR s.user_id = ?)`,
            [projectId, userId, userId]
        );
        return rows[0] || null;
    };

    const getProjectParticipants = async (projectId) => {
        const [rows] = await db.query(
            `SELECT
                p.project_id,
                p.project_status,
                c.user_id AS client_user_id,
                s.user_id AS student_user_id
             FROM projects p
             INNER JOIN clients c ON p.client_id = c.client_id
             INNER JOIN students s ON p.student_id = s.student_id
             WHERE p.project_id = ?`,
            [projectId]
        );
        return rows[0] || null;
    };


// ======================================================
// CREATE PROJECT
// ======================================================
const createProject = async (
    applicationId,
    studentId,
    clientId,
    projectTitle,
    agreedAmount,
    startDate,
    expectedEndDate
) => {

    const [result] = await db.query(
        `INSERT INTO projects
        (
            application_id,
            student_id,
            client_id,
            project_title,
            agreed_amount,
            start_date,
            expected_end_date,
            project_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'NOT_STARTED')`,
        [
            applicationId,
            studentId,
            clientId,
            projectTitle,
            agreedAmount,
            startDate,
            expectedEndDate
        ]
    );

    return result.insertId;
};


// ======================================================
// CHECK APPLICATION FOR PROJECT CREATION
// ======================================================
const getAcceptedApplication = async (applicationId, clientId) => {

    const [rows] = await db.query(
        `SELECT
            a.application_id,
            a.student_id,
            a.application_status,
            a.proposed_price,
            g.gig_id,
            g.client_id,
            g.title AS gig_title
         FROM applications a
         INNER JOIN gigs g
            ON a.gig_id = g.gig_id
         WHERE a.application_id = ?
         AND g.client_id = ?`,
        [applicationId, clientId]
    );

    return rows.length ? rows[0] : null;
};


// ======================================================
// CHECK WHETHER PROJECT ALREADY EXISTS
// ======================================================
const getProjectByApplicationId = async (applicationId) => {

    const [rows] = await db.query(
        `SELECT *
         FROM projects
         WHERE application_id = ?`,
        [applicationId]
    );

    return rows.length ? rows[0] : null;
};


// ======================================================
// GET PROJECTS OF CLIENT
// ======================================================
const getProjectsByClient = async (clientId) => {

    const [rows] = await db.query(
        `SELECT
            p.*,
            a.application_status,
            g.title AS gig_title,
            u.name AS student_name,
            u.email AS student_email,
            u.user_id AS student_user_id
         FROM projects p

         INNER JOIN applications a
            ON p.application_id = a.application_id

         INNER JOIN gigs g
            ON a.gig_id = g.gig_id

         INNER JOIN students s
            ON p.student_id = s.student_id

         INNER JOIN users u
            ON s.user_id = u.user_id

         WHERE p.client_id = ?

         ORDER BY p.created_at DESC`,
        [clientId]
    );

    return rows;
};


// ======================================================
// GET SINGLE CLIENT PROJECT
// ======================================================
const getClientProject = async (projectId, clientId) => {

    const [rows] = await db.query(
        `SELECT
            p.*,
            a.application_status,
            g.title AS gig_title,
            g.description AS gig_description,
            u.name AS student_name,
            u.email AS student_email
         FROM projects p

         INNER JOIN applications a
            ON p.application_id = a.application_id

         INNER JOIN gigs g
            ON a.gig_id = g.gig_id

         INNER JOIN students s
            ON p.student_id = s.student_id

         INNER JOIN users u
            ON s.user_id = u.user_id

         WHERE p.project_id = ?
         AND p.client_id = ?`,
        [projectId, clientId]
    );

    return rows.length ? rows[0] : null;
};


// ======================================================
// GET PROJECTS OF STUDENT
// ======================================================
const getProjectsByStudent = async (studentId) => {

    const [rows] = await db.query(
        `SELECT
            p.*,
            g.title AS gig_title,
            u.name AS client_name,
            u.email AS client_email,
            u.user_id AS client_user_id
         FROM projects p

         INNER JOIN gigs g
            ON p.client_id = g.client_id

         INNER JOIN clients c
            ON p.client_id = c.client_id

         INNER JOIN users u
            ON c.user_id = u.user_id

         WHERE p.student_id = ?

         ORDER BY p.created_at DESC`,
        [studentId]
    );

    return rows;
};


// ======================================================
// GET SINGLE STUDENT PROJECT
// ======================================================
const getStudentProject = async (projectId, studentId) => {

    const [rows] = await db.query(
        `SELECT
            p.*,
            g.title AS gig_title,
            g.description AS gig_description,
            u.name AS client_name,
            u.email AS client_email,
            u.user_id AS client_user_id
         FROM projects p

         INNER JOIN gigs g
            ON p.client_id = g.client_id

         INNER JOIN clients c
            ON p.client_id = c.client_id

         INNER JOIN users u
            ON c.user_id = u.user_id

         WHERE p.project_id = ?
         AND p.student_id = ?`,
        [projectId, studentId]
    );

    return rows.length ? rows[0] : null;
};


// ======================================================
// UPDATE PROJECT STATUS
// ======================================================
const updateProjectStatus = async (projectId, clientId, status) => {

    const [result] = await db.query(
        `UPDATE projects
         SET
            project_status = ?,
            actual_end_date =
                CASE
                    WHEN ? = 'COMPLETED'
                    THEN CURDATE()
                    ELSE actual_end_date
                END
         WHERE project_id = ?
         AND client_id = ?`,
        [
            status,
            status,
            projectId,
            clientId
        ]
    );

    return result.affectedRows;
};


module.exports = {
    getClientIdByUserId,
        getProjectAccess,
        getProjectParticipants,
    createProject,
    getAcceptedApplication,
    getProjectByApplicationId,
    getProjectsByClient,
    getClientProject,
    getProjectsByStudent,
    getStudentProject,
    updateProjectStatus
};