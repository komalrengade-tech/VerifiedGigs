const express = require('express');

const {
    authenticateToken
} = require('../middleware/authMiddleware');

const {
    addNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
} = require('../controllers/notificationController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();


// ========================================
// CREATE NOTIFICATION
// ========================================

router.post(
    '/notifications',
    authenticateToken,
    authorizeRoles('ADMIN'),
    addNotification
);


// ========================================
// GET MY NOTIFICATIONS
// ========================================

router.get(
    '/notifications',
    authenticateToken,
    getMyNotifications
);


// ========================================
// UNREAD COUNT
// ========================================

router.get(
    '/notifications/unread-count',
    authenticateToken,
    getUnreadCount
);


// ========================================
// MARK ONE AS READ
// ========================================

router.put(
    '/notifications/:notificationId/read',
    authenticateToken,
    markAsRead
);


// ========================================
// MARK ALL AS READ
// ========================================

router.put(
    '/notifications/read-all',
    authenticateToken,
    markAllAsRead
);


module.exports = router;