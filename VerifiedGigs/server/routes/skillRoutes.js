const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    getSkills,
    createNewSkill,
    addSkill,
    studentSkills,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');

const router = express.Router();


// Get all skills
router.get(
    '/skills',
    authenticateToken,
    getSkills
);


// Create skill
router.post(
    '/skills',
    authenticateToken,
    createNewSkill
);


// Add skill to student
router.post(
    '/student/skills',
    authenticateToken,
    authorizeRoles('STUDENT'),
    addSkill
);


// Get student's skills
router.get(
    '/student/skills',
    authenticateToken,
    authorizeRoles('STUDENT'),
    studentSkills
);


// Update student's skill
router.put(
    '/student/skills/:skillId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    updateSkill
);


// Delete student's skill
router.delete(
    '/student/skills/:skillId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    deleteSkill
);


module.exports = router;