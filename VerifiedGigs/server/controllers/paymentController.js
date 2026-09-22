const {
    createPayment,
    getPaymentById,
    getProjectPayments,
    processPayment,
    failPayment,
    refundPayment
} = require('../models/paymentModel');
const { getProjectAccess } = require('../models/projectModel');
const { createNotification } = require('../models/notificationModel');

const requireProjectAccess = async (req, res, projectId, mutation = false) => {
    const access = await getProjectAccess(projectId, req.user.user_id);
    if (!access) {
        res.status(404).json({ message: 'Project not found or access denied' });
        return false;
    }
    if (mutation && Number(access.client_user_id) !== Number(req.user.user_id)) {
        res.status(403).json({ message: 'Only the project client can modify payments' });
        return false;
    }
    return true;
};

const getPaymentProjectId = async (paymentId) => {
    const payment = await getPaymentById(paymentId);
    return payment?.project_id || null;
};


// ========================================
// CREATE PAYMENT
// ========================================

const addPayment = async (req, res) => {

    try {

        const projectId = req.params.projectId;

        if (!await requireProjectAccess(req, res, projectId, true)) return;

        const {
            milestoneId,
            amount,
            paymentMethod
        } = req.body;

        if (!amount) {
            return res.status(400).json({
                message: 'Payment amount is required'
            });
        }

        const paymentId = await createPayment(
            projectId,
            milestoneId || null,
            amount,
            paymentMethod || null
        );

        res.status(201).json({
            message: 'Payment created successfully',
            paymentId
        });

    } catch (error) {

        console.error('Create payment error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET PAYMENT
// ========================================

const getPayment = async (req, res) => {

    try {

        const paymentId = req.params.paymentId;

        const projectId = await getPaymentProjectId(paymentId);
        if (!projectId || !await requireProjectAccess(req, res, projectId)) return;

        const payment = await getPaymentById(paymentId);

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            payment
        });

    } catch (error) {

        console.error('Get payment error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET PROJECT PAYMENTS
// ========================================

const getPayments = async (req, res) => {

    try {

        const projectId = req.params.projectId;

        if (!await requireProjectAccess(req, res, projectId)) return;

        const payments = await getProjectPayments(projectId);

        res.status(200).json({
            payments
        });

    } catch (error) {

        console.error('Get project payments error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// PROCESS PAYMENT
// ========================================

const makePayment = async (req, res) => {

    try {

        const paymentId = req.params.paymentId;

        const projectId = await getPaymentProjectId(paymentId);
        if (!projectId || !await requireProjectAccess(req, res, projectId, true)) return;

        // Generate simulated transaction ID
        const transactionId =
            'TXN_' +
            Date.now() +
            '_' +
            Math.floor(Math.random() * 10000);

        const affectedRows = await processPayment(
            paymentId,
            transactionId
        );

        if (affectedRows === 0) {

            return res.status(400).json({
                message: 'Payment cannot be processed or is already completed'
            });

        }

        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const access = await getProjectAccess(projectId, req.user.user_id);
            const payment = await getPaymentById(paymentId);

            if (access?.student_user_id) {

                await createNotification(
                    access.student_user_id,
                    'Payment processed',
                    `A payment of ₹${Number(payment?.amount || 0).toLocaleString('en-IN')} was processed for your project.`,
                    'PAYMENT',
                    Number(paymentId)
                );
            }

        } catch (notifyError) {

            console.error('Payment notification error:', notifyError);
        }

        res.status(200).json({
            message: 'Payment successful',
            transactionId
        });

    } catch (error) {

        console.error('Process payment error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// FAIL PAYMENT
// ========================================

const markPaymentFailed = async (req, res) => {

    try {

        const paymentId = req.params.paymentId;

        const projectId = await getPaymentProjectId(paymentId);
        if (!projectId || !await requireProjectAccess(req, res, projectId, true)) return;

        const affectedRows = await failPayment(paymentId);

        if (affectedRows === 0) {

            return res.status(400).json({
                message: 'Payment cannot be marked as failed'
            });

        }

        res.status(200).json({
            message: 'Payment marked as failed'
        });

    } catch (error) {

        console.error('Fail payment error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// REFUND PAYMENT
// ========================================

const refund = async (req, res) => {

    try {

        const paymentId = req.params.paymentId;

        const projectId = await getPaymentProjectId(paymentId);
        if (!projectId || !await requireProjectAccess(req, res, projectId, true)) return;

        const affectedRows = await refundPayment(paymentId);

        if (affectedRows === 0) {

            return res.status(400).json({
                message: 'Only successful payments can be refunded'
            });

        }

        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const access = await getProjectAccess(projectId, req.user.user_id);
            const payment = await getPaymentById(paymentId);

            if (access?.student_user_id) {

                await createNotification(
                    access.student_user_id,
                    'Payment refunded',
                    `A payment of ₹${Number(payment?.amount || 0).toLocaleString('en-IN')} for your project was refunded.`,
                    'PAYMENT',
                    Number(paymentId)
                );
            }

        } catch (notifyError) {

            console.error('Refund notification error:', notifyError);
        }

        res.status(200).json({
            message: 'Payment refunded successfully'
        });

    } catch (error) {

        console.error('Refund payment error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addPayment,
    getPayment,
    getPayments,
    makePayment,
    markPaymentFailed,
    refund
};