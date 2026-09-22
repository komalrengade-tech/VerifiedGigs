const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    applyToGig,
    getMyApplications,
    getMyApplication,
    withdrawMyApplication,

    getClientApplicationList,
    getClientApplication,
    changeApplicationStatus

} = require('../controllers/applicationController');


const router = express.Router();


// ======================================================
// STUDENT APPLICATION ROUTES
// ======================================================


// Apply to a gig

router.post(
    '/student/applications',
    authenticateToken,
    authorizeRoles('STUDENT'),
    applyToGig
);


// Get my applications

router.get(
    '/student/applications',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getMyApplications
);


// Get one application

router.get(
    '/student/applications/:applicationId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getMyApplication
);


// Withdraw application

router.delete(
    '/student/applications/:applicationId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    withdrawMyApplication
);


// ======================================================
// CLIENT APPLICATION ROUTES
// ======================================================


// Get applications for my gigs

router.get(
    '/client/applications',
    authenticateToken,
    authorizeRoles('CLIENT'),
    getClientApplicationList
);


// Get one application

router.get(
    '/client/applications/:applicationId',
    authenticateToken,
    authorizeRoles('CLIENT'),
    getClientApplication
);


// Change application status

router.put(
    '/client/applications/:applicationId/status',
    authenticateToken,
    authorizeRoles('CLIENT'),
    changeApplicationStatus
);


module.exports = router;