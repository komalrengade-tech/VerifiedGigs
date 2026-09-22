 const pool = require('../config/db');


// ======================================================
// GET APPLICATION STATISTICS
// ======================================================

const getApplicationStats = async (studentId) => {

    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS totalApplications,

            SUM(
                CASE
                    WHEN application_status = 'PENDING'
                    THEN 1
                    ELSE 0
                END
            ) AS pendingApplications,

            SUM(
                CASE
                    WHEN application_status = 'SHORTLISTED'
                    THEN 1
                    ELSE 0
                END
            ) AS shortlistedApplications,

            SUM(
                CASE
                    WHEN application_status = 'ACCEPTED'
                    THEN 1
                    ELSE 0
                END
            ) AS acceptedApplications,

            SUM(
                CASE
                    WHEN application_status = 'REJECTED'
                    THEN 1
                    ELSE 0
                END
            ) AS rejectedApplications,

            SUM(
                CASE
                    WHEN application_status = 'WITHDRAWN'
                    THEN 1
                    ELSE 0
                END
            ) AS withdrawnApplications

        FROM applications

        WHERE student_id = ?`,
        [studentId]
    );

    return {
        totalApplications: Number(rows[0].totalApplications),
        pendingApplications: Number(rows[0].pendingApplications),
        shortlistedApplications: Number(rows[0].shortlistedApplications),
        acceptedApplications: Number(rows[0].acceptedApplications),
        rejectedApplications: Number(rows[0].rejectedApplications),
        withdrawnApplications: Number(rows[0].withdrawnApplications)
    };
};


// ======================================================
// GET ACTIVE PROJECT COUNT
// ======================================================

const getActiveProjectCount = async (studentId) => {

    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS activeProjects

        FROM projects

        WHERE student_id = ?

        AND project_status IN (
            'NOT_STARTED',
            'IN_PROGRESS'
        )`,
        [studentId]
    );

    return Number(rows[0].activeProjects);
};


// ======================================================
// GET UNREAD NOTIFICATION COUNT
// ======================================================

const getUnreadNotificationCount = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS unreadNotifications

        FROM notifications

        WHERE user_id = ?

        AND is_read = 0`,
        [userId]
    );

    return Number(rows[0].unreadNotifications);
};


// ======================================================
// GET RECENT APPLICATIONS
// ======================================================

const getRecentApplications = async (studentId) => {

    const [rows] = await pool.query(
        `SELECT
            a.application_id,
            a.gig_id,
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

            c.client_id,
            c.company_name

        FROM applications a

        INNER JOIN gigs g
            ON a.gig_id = g.gig_id

        INNER JOIN clients c
            ON g.client_id = c.client_id

        WHERE a.student_id = ?

        ORDER BY a.applied_at DESC

        LIMIT 5`,
        [studentId]
    );

    return rows;
};


// ======================================================
// GET ACTIVE PROJECTS
// ======================================================

const getActiveProjects = async (studentId) => {

    const [rows] = await pool.query(
        `SELECT
            p.project_id,
            p.application_id,
            p.project_title,
            p.agreed_amount,
            p.start_date,
            p.expected_end_date,
            p.actual_end_date,
            p.project_status,
            p.created_at,

            c.client_id,
            c.company_name

        FROM projects p

        INNER JOIN clients c
            ON p.client_id = c.client_id

        WHERE p.student_id = ?

        AND p.project_status IN (
            'NOT_STARTED',
            'IN_PROGRESS'
        )

        ORDER BY p.created_at DESC

        LIMIT 5`,
        [studentId]
    );

    return rows;
};


// ======================================================
// GET RECENT NOTIFICATIONS
// ======================================================

const getRecentNotifications = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            notification_id,
            title,
            message,
            notification_type,
            related_entity_id,
            is_read,
            created_at

        FROM notifications

        WHERE user_id = ?

        ORDER BY created_at DESC

        LIMIT 5`,
        [userId]
    );

    return rows;
};


// ======================================================
// EXPORT FUNCTIONS
// ======================================================

module.exports = {
    getApplicationStats,
    getActiveProjectCount,
    getUnreadNotificationCount,
    getRecentApplications,
    getActiveProjects,
    getRecentNotifications
};