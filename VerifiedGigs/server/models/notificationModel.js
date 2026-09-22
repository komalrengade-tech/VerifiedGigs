const pool = require('../config/db');


// ========================================
// CREATE NOTIFICATION
// ========================================

const createNotification = async (
    userId,
    title,
    message,
    notificationType,
    relatedEntityId
) => {

    const [result] = await pool.query(
        `INSERT INTO notifications
        (
            user_id,
            title,
            message,
            notification_type,
            related_entity_id
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            userId,
            title,
            message,
            notificationType || null,
            relatedEntityId || null
        ]
    );

    return result.insertId;
};


// ========================================
// GET USER NOTIFICATIONS
// ========================================

const getUserNotifications = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            notification_id,
            user_id,
            title,
            message,
            notification_type,
            related_entity_id,
            is_read,
            created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};


// ========================================
// MARK ONE AS READ
// ========================================

const markNotificationAsRead = async (
    notificationId,
    userId
) => {

    const [result] = await pool.query(
        `UPDATE notifications
         SET is_read = 1
         WHERE notification_id = ?
         AND user_id = ?`,
        [
            notificationId,
            userId
        ]
    );

    return result.affectedRows;
};


// ========================================
// MARK ALL AS READ
// ========================================

const markAllNotificationsAsRead = async (
    userId
) => {

    const [result] = await pool.query(
        `UPDATE notifications
         SET is_read = 1
         WHERE user_id = ?
         AND is_read = 0`,
        [userId]
    );

    return result.affectedRows;
};


// ========================================
// COUNT UNREAD
// ========================================

const getUnreadNotificationCount = async (
    userId
) => {

    const [rows] = await pool.query(
        `SELECT COUNT(*) AS unread_count
         FROM notifications
         WHERE user_id = ?
         AND is_read = 0`,
        [userId]
    );

    return rows[0].unread_count;
};


module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
};