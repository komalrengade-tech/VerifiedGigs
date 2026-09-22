const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    addPayment,
    getPayment,
    getPayments,
    makePayment,
    markPaymentFailed,
    refund
} = require('../controllers/paymentController');

const router = express.Router();


// CLIENT creates payment record
router.post(
    '/projects/:projectId/payments',
    authenticateToken,
    authorizeRoles('CLIENT'),
    addPayment
);


// Get project payments
router.get(
    '/projects/:projectId/payments',
    authenticateToken,
    getPayments
);


// Get single payment
router.get(
    '/payments/:paymentId',
    authenticateToken,
    getPayment
);


// Process payment
router.put(
    '/payments/:paymentId/process',
    authenticateToken,
    authorizeRoles('CLIENT'),
    makePayment
);


// Mark payment failed
router.put(
    '/payments/:paymentId/fail',
    authenticateToken,
    authorizeRoles('CLIENT'),
    markPaymentFailed
);


// Refund payment
router.put(
    '/payments/:paymentId/refund',
    authenticateToken,
    authorizeRoles('CLIENT'),
    refund
);


module.exports = router;