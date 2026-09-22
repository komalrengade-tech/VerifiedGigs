const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    createProject,
    getClientProjects,
    getClientProject,
    getStudentProjects,
    getStudentProject,
    updateProjectStatus
} = require('../controllers/projectController');

const router = express.Router();


// ======================================================
// CLIENT ROUTES
// ======================================================

router.post(
    '/client/projects',
    authenticateToken,
    authorizeRoles('CLIENT'),
    createProject
);


router.get(
    '/client/projects',
    authenticateToken,
    authorizeRoles('CLIENT'),
    getClientProjects
);


router.get(
    '/client/projects/:projectId',
    authenticateToken,
    authorizeRoles('CLIENT'),
    getClientProject
);


router.put(
    '/client/projects/:projectId/status',
    authenticateToken,
    authorizeRoles('CLIENT'),
    updateProjectStatus
);


// ======================================================
// STUDENT ROUTES
// ======================================================

router.get(
    '/student/projects',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getStudentProjects
);


router.get(
    '/student/projects/:projectId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getStudentProject
);


module.exports = router;