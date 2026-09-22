const {
    createMessage,
    getProjectMessages,
    getConversation,
    getMessageById,
    markMessageAsRead
} = require('../models/messageModel');
const { getProjectAccess } = require('../models/projectModel');
const { createNotification } = require('../models/notificationModel');


// ========================================
// SEND MESSAGE
// ========================================

const sendMessage = async (req, res) => {

    try {

        const senderId = req.user.user_id;

        const {
            receiverId,
            projectId,
            messageText,
            attachmentUrl
        } = req.body;


        if (!receiverId) {

            return res.status(400).json({
                message: 'Receiver ID is required'
            });
        }

        if (projectId) {
            const access = await getProjectAccess(projectId, senderId);
            if (!access || (Number(receiverId) !== Number(access.client_user_id) && Number(receiverId) !== Number(access.student_user_id))) {
                return res.status(403).json({ message: 'Only project participants can message each other' });
            }
        }


        if (!messageText || !messageText.trim()) {

            return res.status(400).json({
                message: 'Message text is required'
            });
        }


        // Prevent sending message to yourself

        if (
            Number(receiverId) ===
            Number(senderId)
        ) {

            return res.status(400).json({
                message: 'You cannot send a message to yourself'
            });
        }


        const messageId = await createMessage(
            senderId,
            receiverId,
            projectId || null,
            messageText.trim(),
            attachmentUrl || null
        );


        // --------------------------------------------------
        // NOTIFY RECEIVER
        // --------------------------------------------------

        try {

            await createNotification(
                receiverId,
                'New message',
                `You received a new message: "${messageText.trim().slice(0, 80)}${messageText.trim().length > 80 ? '...' : ''}"`,
                'MESSAGE',
                messageId
            );

        } catch (notifyError) {

            console.error(
                'Message notification error:',
                notifyError
            );
        }


        res.status(201).json({

            message: 'Message sent successfully',

            messageId

        });


    } catch (error) {

        console.error(
            'Send message error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET PROJECT MESSAGES
// ========================================

const getMessagesForProject = async (
    req,
    res
) => {

    try {

        const projectId =
            req.params.projectId;

        const userId =
            req.user.user_id;

        if (!await getProjectAccess(projectId, userId)) {
            return res.status(403).json({ message: 'Only project participants can access messages' });
        }


        const messages =
            await getProjectMessages(
                projectId,
                userId
            );


        res.status(200).json({
            messages
        });


    } catch (error) {

        console.error(
            'Get project messages error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET CONVERSATION
// ========================================

const getMessagesBetweenUsers = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const otherUserId =
            req.params.userId;


        const messages =
            await getConversation(
                userId,
                otherUserId
            );


        res.status(200).json({
            messages
        });


    } catch (error) {

        console.error(
            'Get conversation error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// MARK MESSAGE AS READ
// ========================================

const markAsRead = async (
    req,
    res
) => {

    try {

        const messageId =
            req.params.messageId;

        const receiverId =
            req.user.user_id;


        const affectedRows =
            await markMessageAsRead(
                messageId,
                receiverId
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Message not found or you are not the receiver'
            });
        }


        res.status(200).json({

            message:
                'Message marked as read'

        });


    } catch (error) {

        console.error(
            'Mark message read error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    sendMessage,
    getMessagesForProject,
    getMessagesBetweenUsers,
    markAsRead
};