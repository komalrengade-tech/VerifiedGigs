const pool = require('../config/db');


// ========================================
// CREATE PAYMENT
// ========================================

const createPayment = async (
    projectId,
    milestoneId,
    amount,
    paymentMethod
) => {

    const [result] = await pool.query(
        `INSERT INTO payment
        (
            project_id,
            milestone_id,
            amount,
            payment_method,
            payment_status
        )
        VALUES (?, ?, ?, ?, 'PENDING')`,
        [
            projectId,
            milestoneId || null,
            amount,
            paymentMethod || null
        ]
    );

    return result.insertId;
};


// ========================================
// GET PAYMENT BY ID
// ========================================

const getPaymentById = async (paymentId) => {

    const [rows] = await pool.query(
        `SELECT
            payment_id,
            project_id,
            milestone_id,
            amount,
            payment_method,
            transaction_id,
            payment_status,
            payment_date
         FROM payment
         WHERE payment_id = ?`,
        [paymentId]
    );

    return rows[0];
};


// ========================================
// GET PROJECT PAYMENTS
// ========================================

const getProjectPayments = async (projectId) => {

    const [rows] = await pool.query(
        `SELECT
            payment_id,
            project_id,
            milestone_id,
            amount,
            payment_method,
            transaction_id,
            payment_status,
            payment_date
         FROM payment
         WHERE project_id = ?
         ORDER BY payment_date DESC`,
        [projectId]
    );

    return rows;
};


// ========================================
// PROCESS PAYMENT
// ========================================

const processPayment = async (
    paymentId,
    transactionId
) => {

    const [result] = await pool.query(
        `UPDATE payment
         SET payment_status = 'SUCCESS',
             transaction_id = ?,
             payment_date = CURRENT_TIMESTAMP
         WHERE payment_id = ?
         AND payment_status = 'PENDING'`,
        [
            transactionId,
            paymentId
        ]
    );

    return result.affectedRows;
};


// ========================================
// MARK PAYMENT FAILED
// ========================================

const failPayment = async (paymentId) => {

    const [result] = await pool.query(
        `UPDATE payment
         SET payment_status = 'FAILED',
             payment_date = CURRENT_TIMESTAMP
         WHERE payment_id = ?
         AND payment_status = 'PENDING'`,
        [paymentId]
    );

    return result.affectedRows;
};


// ========================================
// REFUND PAYMENT
// ========================================

const refundPayment = async (paymentId) => {

    const [result] = await pool.query(
        `UPDATE payment
         SET payment_status = 'REFUNDED'
         WHERE payment_id = ?
         AND payment_status = 'SUCCESS'`,
        [paymentId]
    );

    return result.affectedRows;
};


module.exports = {
    createPayment,
    getPaymentById,
    getProjectPayments,
    processPayment,
    failPayment,
    refundPayment
};