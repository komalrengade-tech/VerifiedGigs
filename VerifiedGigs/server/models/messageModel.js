const pool = require('../config/db');


// ========================================
// SEND MESSAGE
// ========================================

const createMessage = async (
    senderId,
    receiverId,
    projectId,
    messageText,
    attachmentUrl
) => {

    const [result] = await pool.query(
        `INSERT INTO messages
        (
            sender_id,
            receiver_id,
            project_id,
            message_text,
            attachment_url
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            senderId,
            receiverId,
            projectId || null,
            messageText,
            attachmentUrl || null
        ]
    );

    return result.insertId;
};


// ========================================
// GET PROJECT MESSAGES
// ========================================

const getProjectMessages = async (
    projectId,
    userId
) => {

    const [rows] = await pool.query(
        `SELECT
            m.message_id,
            m.sender_id,
            sender.name AS sender_name,
            m.receiver_id,
            receiver.name AS receiver_name,
            m.project_id,
            m.message_text,
            m.attachment_url,
            m.sent_at,
            m.read_status
         FROM messages m

         INNER JOIN users sender
             ON m.sender_id = sender.user_id

         INNER JOIN users receiver
             ON m.receiver_id = receiver.user_id

         WHERE m.project_id = ?
         AND (
             m.sender_id = ?
             OR m.receiver_id = ?
         )

         ORDER BY m.sent_at ASC`,
        [
            projectId,
            userId,
            userId
        ]
    );

    return rows;
};


// ========================================
// GET CONVERSATION
// ========================================

const getConversation = async (
    userId,
    otherUserId
) => {

    const [rows] = await pool.query(
        `SELECT
            m.message_id,
            m.sender_id,
            sender.name AS sender_name,
            m.receiver_id,
            receiver.name AS receiver_name,
            m.project_id,
            m.message_text,
            m.attachment_url,
            m.sent_at,
            m.read_status
         FROM messages m

         INNER JOIN users sender
             ON m.sender_id = sender.user_id

         INNER JOIN users receiver
             ON m.receiver_id = receiver.user_id

         WHERE
            (m.sender_id = ? AND m.receiver_id = ?)
            OR
            (m.sender_id = ? AND m.receiver_id = ?)

         ORDER BY m.sent_at ASC`,
        [
            userId,
            otherUserId,
            otherUserId,
            userId
        ]
    );

    return rows;
};


// ========================================
// GET SINGLE MESSAGE
// ========================================

const getMessageById = async (
    messageId
) => {

    const [rows] = await pool.query(
        `SELECT
            message_id,
            sender_id,
            receiver_id,
            project_id,
            message_text,
            attachment_url,
            sent_at,
            read_status
         FROM messages
         WHERE message_id = ?`,
        [messageId]
    );

    return rows[0];
};


// ========================================
// MARK MESSAGE AS READ
// ========================================

const markMessageAsRead = async (
    messageId,
    receiverId
) => {

    const [result] = await pool.query(
        `UPDATE messages
         SET read_status = 1
         WHERE message_id = ?
         AND receiver_id = ?`,
        [
            messageId,
            receiverId
        ]
    );

    return result.affectedRows;
};


// ========================================
// MARK ALL MESSAGES AS READ
// ========================================

const markConversationAsRead = async (
    senderId,
    receiverId
) => {

    const [result] = await pool.query(
        `UPDATE messages
         SET read_status = 1
         WHERE sender_id = ?
         AND receiver_id = ?
         AND read_status = 0`,
        [
            senderId,
            receiverId
        ]
    );

    return result.affectedRows;
};


module.exports = {
    createMessage,
    getProjectMessages,
    getConversation,
    getMessageById,
    markMessageAsRead,
    markConversationAsRead
};