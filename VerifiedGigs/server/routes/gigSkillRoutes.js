const express = require('express');

const {
    authenticateToken
} = require('../middleware/authMiddleware');

const {
    addSkill,
    getSkills,
    removeSkill
} = require('../controllers/gigSkillController');

const router = express.Router();


// Add skill to gig
router.post(
    '/gigs/:gigId/skills',
    authenticateToken,
    addSkill
);


// Get skills for gig
router.get(
    '/gigs/:gigId/skills',
    authenticateToken,
    getSkills
);


// Remove skill from gig
router.delete(
    '/gigs/:gigId/skills/:skillId',
    authenticateToken,
    removeSkill
);


module.exports = router;