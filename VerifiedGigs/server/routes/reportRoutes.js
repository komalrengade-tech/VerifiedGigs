const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    addReport,
    getMyReportList,
    getReportList,
    getReport,
    changeReportStatus
} = require('../controllers/reportController');

const router = express.Router();


// ========================================
// USER → CREATE REPORT
// ========================================

router.post(
    '/reports',
    authenticateToken,
    authorizeRoles('STUDENT', 'CLIENT'),
    addReport
);


// ========================================
// USER → MY REPORTS
// ========================================

router.get(
    '/reports/my',
    authenticateToken,
    authorizeRoles('STUDENT', 'CLIENT'),
    getMyReportList
);


// ========================================
// ADMIN → ALL REPORTS
// ========================================

router.get(
    '/reports',
    authenticateToken,
    authorizeRoles('ADMIN'),
    getReportList
);


// ========================================
// ADMIN → SINGLE REPORT
// ========================================

router.get(
    '/reports/:reportId',
    authenticateToken,
    authorizeRoles('ADMIN'),
    getReport
);


// ========================================
// ADMIN → UPDATE STATUS
// ========================================

router.put(
    '/reports/:reportId/status',
    authenticateToken,
    authorizeRoles('ADMIN'),
    changeReportStatus
);


module.exports = router;