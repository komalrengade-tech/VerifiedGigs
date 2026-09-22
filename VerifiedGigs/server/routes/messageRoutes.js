const express = require('express');

const {
    authenticateToken
} = require('../middleware/authMiddleware');

const {
    sendMessage,
    getMessagesForProject,
    getMessagesBetweenUsers,
    markAsRead
} = require('../controllers/messageController');

const router = express.Router();


// ========================================
// SEND MESSAGE
// ========================================

router.post(
    '/messages',
    authenticateToken,
    sendMessage
);


// ========================================
// PROJECT CHAT
// ========================================

router.get(
    '/projects/:projectId/messages',
    authenticateToken,
    getMessagesForProject
);


// ========================================
// DIRECT CONVERSATION
// ========================================

router.get(
    '/conversations/:userId',
    authenticateToken,
    getMessagesBetweenUsers
);


// ========================================
// MARK AS READ
// ========================================

router.put(
    '/messages/:messageId/read',
    authenticateToken,
    markAsRead
);


module.exports = router;