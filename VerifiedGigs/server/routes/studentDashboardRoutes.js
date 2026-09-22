const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    getStudentDashboard
} = require('../controllers/studentDashboardController');


const router = express.Router();


// ======================================================
// STUDENT DASHBOARD
// ======================================================

router.get(
    '/student/dashboard',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getStudentDashboard
);


module.exports = router;