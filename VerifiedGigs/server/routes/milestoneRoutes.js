const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    addMilestone,
    getMilestones,
    editMilestone,
    markCompleted,
    removeMilestone
} = require('../controllers/milestoneController');

const router = express.Router();


// CLIENT creates milestone
router.post(
    '/projects/:projectId/milestones',
    authenticateToken,
    authorizeRoles('CLIENT'),
    addMilestone
);


// Get milestones
router.get(
    '/projects/:projectId/milestones',
    authenticateToken,
    getMilestones
);


// CLIENT updates milestone
router.put(
    '/milestones/:milestoneId',
    authenticateToken,
    authorizeRoles('CLIENT'),
    editMilestone
);


// Mark completed
router.put(
    '/milestones/:milestoneId/complete',
    authenticateToken,
    authorizeRoles('CLIENT'),
    markCompleted
);


// CLIENT deletes milestone
router.delete(
    '/milestones/:milestoneId',
    authenticateToken,
    authorizeRoles('CLIENT'),
    removeMilestone
);


module.exports = router;