const pool = require('../config/db');


// ========================================
// CREATE REPORT
// ========================================

const createReport = async (
    reporterId,
    reportedUserId,
    gigId,
    projectId,
    reason,
    description
) => {

    const [result] = await pool.query(
        `INSERT INTO reports
        (
            reporter_id,
            reported_user_id,
            gig_id,
            project_id,
            reason,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            reporterId,
            reportedUserId || null,
            gigId || null,
            projectId || null,
            reason,
            description || null
        ]
    );

    return result.insertId;
};


// ========================================
// GET REPORTS CREATED BY USER
// ========================================

const getMyReports = async (reporterId) => {

    const [rows] = await pool.query(
        `SELECT
            report_id,
            reporter_id,
            reported_user_id,
            gig_id,
            project_id,
            reason,
            description,
            report_status,
            reported_at,
            resolved_by,
            resolved_at
         FROM reports
         WHERE reporter_id = ?
         ORDER BY reported_at DESC`,
        [reporterId]
    );

    return rows;
};


// ========================================
// GET ALL REPORTS
// ADMIN
// ========================================

const getAllReports = async () => {

    const [rows] = await pool.query(
        `SELECT
            r.report_id,
            r.reporter_id,
            reporter.name AS reporter_name,

            r.reported_user_id,
            reported.name AS reported_user_name,

            r.gig_id,
            r.project_id,

            r.reason,
            r.description,
            r.report_status,
            r.reported_at,

            r.resolved_by,
            admin_user.name AS resolved_by_name,

            r.resolved_at

         FROM reports r

         INNER JOIN users reporter
             ON r.reporter_id = reporter.user_id

         LEFT JOIN users reported
             ON r.reported_user_id = reported.user_id

         LEFT JOIN users admin_user
             ON r.resolved_by = admin_user.user_id

         ORDER BY r.reported_at DESC`
    );

    return rows;
};


// ========================================
// GET REPORT BY ID
// ========================================

const getReportById = async (reportId) => {

    const [rows] = await pool.query(
        `SELECT
            report_id,
            reporter_id,
            reported_user_id,
            gig_id,
            project_id,
            reason,
            description,
            report_status,
            reported_at,
            resolved_by,
            resolved_at
         FROM reports
         WHERE report_id = ?`,
        [reportId]
    );

    return rows[0];
};


// ========================================
// UPDATE REPORT STATUS
// ========================================

const updateReportStatus = async (
    reportId,
    status,
    resolvedBy
) => {

    let query;
    let params;


    if (
        status === 'RESOLVED' ||
        status === 'REJECTED'
    ) {

        query = `
            UPDATE reports
            SET
                report_status = ?,
                resolved_by = ?,
                resolved_at = CURRENT_TIMESTAMP
            WHERE report_id = ?
        `;

        params = [
            status,
            resolvedBy,
            reportId
        ];

    } else {

        query = `
            UPDATE reports
            SET
                report_status = ?,
                resolved_by = NULL,
                resolved_at = NULL
            WHERE report_id = ?
        `;

        params = [
            status,
            reportId
        ];
    }


    const [result] =
        await pool.query(
            query,
            params
        );

    return result.affectedRows;
};


module.exports = {
    createReport,
    getMyReports,
    getAllReports,
    getReportById,
    updateReportStatus
};