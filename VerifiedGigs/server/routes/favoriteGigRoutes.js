const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    saveGig,
    unsaveGig,
    getMyFavorites,
    checkIfFavorite
} = require('../controllers/favoriteGigController');

const router = express.Router();


// ========================================
// ADD FAVORITE
// ========================================

router.post(
    '/favorites/:gigId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    saveGig
);


// ========================================
// REMOVE FAVORITE
// ========================================

router.delete(
    '/favorites/:gigId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    unsaveGig
);


// ========================================
// GET MY FAVORITES
// ========================================

router.get(
    '/favorites',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getMyFavorites
);


// ========================================
// CHECK FAVORITE
// ========================================

router.get(
    '/favorites/:gigId/check',
    authenticateToken,
    authorizeRoles('STUDENT'),
    checkIfFavorite
);


module.exports = router;