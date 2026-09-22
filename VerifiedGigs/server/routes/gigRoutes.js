const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    getGigs,
    getGig,
    addGig,
    editGig,
    removeGig
} = require('../controllers/gigController');


const router = express.Router();


// ======================================================
// PUBLIC / LOGGED-IN USERS — VIEW GIGS
// ======================================================

router.get(
    '/gigs',
    getGigs
);


router.get(
    '/gigs/:gigId',
    getGig
);


// ======================================================
// CLIENT — CREATE GIG
// ======================================================

router.post(
    '/client/gigs',
    authenticateToken,
    authorizeRoles('CLIENT'),
    addGig
);


// ======================================================
// CLIENT — UPDATE GIG
// ======================================================

router.put(
    '/client/gigs/:gigId',
    authenticateToken,
    authorizeRoles('CLIENT'),
    editGig
);


// ======================================================
// CLIENT — DELETE GIG
// ======================================================

router.delete(
    '/client/gigs/:gigId',
    authenticateToken,
    authorizeRoles('CLIENT'),
    removeGig
);


module.exports = router;