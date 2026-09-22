const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    studentProfile,
    updateStudent,
    clientProfile,
    updateClient
} = require('../controllers/profileController');

const router = express.Router();


// ================================
// STUDENT ROUTES
// ================================

router.get(
    '/student/profile',
    authenticateToken,
    authorizeRoles('STUDENT'),
    studentProfile
);

router.put(
    '/student/profile',
    authenticateToken,
    authorizeRoles('STUDENT'),
    updateStudent
);


// ================================
// CLIENT ROUTES
// ================================

router.get(
    '/client/profile',
    authenticateToken,
    authorizeRoles('CLIENT'),
    clientProfile
);

router.put(
    '/client/profile',
    authenticateToken,
    authorizeRoles('CLIENT'),
    updateClient
);


module.exports = router;