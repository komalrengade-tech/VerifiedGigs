const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
    clientDashboard,
    clientGigs,
    adminDashboard,
    adminUsers,
    adminUser,
    changeUserStatus,
    adminGigs,
    adminDeleteGig,
    adminProjects,
    adminPayments,
    adminProfile,
    updateAdminProfile
} = require('../controllers/managementController');

const router = express.Router();

router.get('/client/dashboard/stats', authenticateToken, authorizeRoles('CLIENT'), clientDashboard);
router.get('/client/gigs', authenticateToken, authorizeRoles('CLIENT'), clientGigs);

router.get('/admin/dashboard/stats', authenticateToken, authorizeRoles('ADMIN'), adminDashboard);
router.get('/admin/users', authenticateToken, authorizeRoles('ADMIN'), adminUsers);
router.get('/admin/users/:userId', authenticateToken, authorizeRoles('ADMIN'), adminUser);
router.put('/admin/users/:userId/status', authenticateToken, authorizeRoles('ADMIN'), changeUserStatus);
router.get('/admin/gigs', authenticateToken, authorizeRoles('ADMIN'), adminGigs);
router.delete('/admin/gigs/:gigId', authenticateToken, authorizeRoles('ADMIN'), adminDeleteGig);
router.get('/admin/projects', authenticateToken, authorizeRoles('ADMIN'), adminProjects);
router.get('/admin/payments', authenticateToken, authorizeRoles('ADMIN'), adminPayments);
router.get('/admin/profile', authenticateToken, authorizeRoles('ADMIN'), adminProfile);
router.put('/admin/profile', authenticateToken, authorizeRoles('ADMIN'), updateAdminProfile);

module.exports = router;
