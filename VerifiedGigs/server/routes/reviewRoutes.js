const express = require('express');

const {
    authenticateToken
} = require('../middleware/authMiddleware');

const {
    addReview,
    getReviewsForProject,
    getReviewsForUser
} = require('../controllers/reviewController');

const router = express.Router();


// ========================================
// CREATE REVIEW
// ========================================

router.post(
    '/projects/:projectId/reviews',
    authenticateToken,
    addReview
);


// ========================================
// GET PROJECT REVIEWS
// ========================================

router.get(
    '/projects/:projectId/reviews',
    authenticateToken,
    getReviewsForProject
);


// ========================================
// GET USER REVIEWS
// ========================================

router.get(
    '/users/:userId/reviews',
    authenticateToken,
    getReviewsForUser
);


module.exports = router;