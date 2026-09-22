const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    addPortfolio,
    getPortfolio,
    editPortfolio,
    removePortfolio
} = require('../controllers/portfolioController');

const router = express.Router();


// Add portfolio
router.post(
    '/student/portfolio',
    authenticateToken,
    authorizeRoles('STUDENT'),
    addPortfolio
);


// Get portfolio
router.get(
    '/student/portfolio',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getPortfolio
);


// Update portfolio
router.put(
    '/student/portfolio/:portfolioId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    editPortfolio
);


// Delete portfolio
router.delete(
    '/student/portfolio/:portfolioId',
    authenticateToken,
    authorizeRoles('STUDENT'),
    removePortfolio
);


module.exports = router;