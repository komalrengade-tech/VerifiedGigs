const pool = require('../config/db');


// ========================================
// CREATE VERIFICATION DOCUMENT
// ========================================

const createVerificationDocument = async (
    studentId,
    documentType,
    documentUrl
) => {

    const [result] = await pool.query(
        `INSERT INTO verification_documents
        (
            student_id,
            document_type,
            document_url
        )
        VALUES (?, ?, ?)`,
        [
            studentId,
            documentType,
            documentUrl
        ]
    );

    return result.insertId;
};


// ========================================
// GET DOCUMENTS UPLOADED BY STUDENT
// ========================================

const getMyVerificationDocuments = async (
    studentId
) => {

    const [rows] = await pool.query(
        `SELECT
            document_id,
            student_id,
            document_type,
            document_url,
            uploaded_at,
            verification_status,
            verified_by,
            verified_at,
            rejection_reason
         FROM verification_documents
         WHERE student_id = ?
         ORDER BY uploaded_at DESC`,
        [studentId]
    );

    return rows;
};


// ========================================
// GET ALL VERIFICATION DOCUMENTS
// ADMIN
// ========================================

const getAllVerificationDocuments = async () => {

    const [rows] = await pool.query(
        `SELECT
            vd.document_id,
            vd.student_id,
            u.name AS student_name,

            vd.document_type,
            vd.document_url,
            vd.uploaded_at,
            vd.verification_status,

            vd.verified_by,
            admin_user.name AS verified_by_name,

            vd.verified_at,
            vd.rejection_reason

         FROM verification_documents vd

         INNER JOIN students s
             ON vd.student_id = s.student_id

         INNER JOIN users u
             ON s.user_id = u.user_id

         LEFT JOIN users admin_user
             ON vd.verified_by = admin_user.user_id

         ORDER BY vd.uploaded_at DESC`
    );

    return rows;
};


// ========================================
// GET PENDING DOCUMENTS
// ADMIN
// ========================================

const getPendingVerificationDocuments = async () => {

    const [rows] = await pool.query(
        `SELECT
            vd.document_id,
            vd.student_id,
            u.name AS student_name,

            vd.document_type,
            vd.document_url,
            vd.uploaded_at,
            vd.verification_status,

            vd.verified_by,
            vd.verified_at,
            vd.rejection_reason

         FROM verification_documents vd

         INNER JOIN students s
             ON vd.student_id = s.student_id

         INNER JOIN users u
             ON s.user_id = u.user_id

         WHERE vd.verification_status = 'PENDING'

         ORDER BY vd.uploaded_at ASC`
    );

    return rows;
};


// ========================================
// GET DOCUMENT BY ID
// ========================================

const getVerificationDocumentById = async (
    documentId
) => {

    const [rows] = await pool.query(
        `SELECT
            document_id,
            student_id,
            document_type,
            document_url,
            uploaded_at,
            verification_status,
            verified_by,
            verified_at,
            rejection_reason
         FROM verification_documents
         WHERE document_id = ?`,
        [documentId]
    );

    return rows[0];
};


// ========================================
// VERIFY DOCUMENT
// ADMIN
// ========================================

const verifyDocument = async (
    documentId,
    adminId
) => {

    const [result] = await pool.query(
        `UPDATE verification_documents
         SET
            verification_status = 'VERIFIED',
            verified_by = ?,
            verified_at = CURRENT_TIMESTAMP,
            rejection_reason = NULL
         WHERE document_id = ?`,
        [
            adminId,
            documentId
        ]
    );

    return result.affectedRows;
};


// ========================================
// REJECT DOCUMENT
// ADMIN
// ========================================

const rejectDocument = async (
    documentId,
    adminId,
    rejectionReason
) => {

    const [result] = await pool.query(
        `UPDATE verification_documents
         SET
            verification_status = 'REJECTED',
            verified_by = ?,
            verified_at = CURRENT_TIMESTAMP,
            rejection_reason = ?
         WHERE document_id = ?`,
        [
            adminId,
            rejectionReason,
            documentId
        ]
    );

    return result.affectedRows;
};


module.exports = {
    createVerificationDocument,
    getMyVerificationDocuments,
    getAllVerificationDocuments,
    getPendingVerificationDocuments,
    getVerificationDocumentById,
    verifyDocument,
    rejectDocument
};