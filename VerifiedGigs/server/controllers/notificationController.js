const {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
} = require('../models/notificationModel');


// ========================================
// CREATE NOTIFICATION
// ========================================

const addNotification = async (req, res) => {

    try {

        const {
            userId,
            title,
            message,
            notificationType,
            relatedEntityId
        } = req.body;


        if (!userId || !title || !message) {

            return res.status(400).json({
                message: 'userId, title and message are required'
            });
        }


        const notificationId =
            await createNotification(
                userId,
                title,
                message,
                notificationType || null,
                relatedEntityId || null
            );


        res.status(201).json({

            message:
                'Notification created successfully',

            notificationId

        });


    } catch (error) {

        console.error(
            'Create notification error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET MY NOTIFICATIONS
// ========================================

const getMyNotifications = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;


        const notifications =
            await getUserNotifications(
                userId
            );


        res.status(200).json({
            notifications
        });


    } catch (error) {

        console.error(
            'Get notifications error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// MARK ONE AS READ
// ========================================

const markAsRead = async (
    req,
    res
) => {

    try {

        const notificationId =
            req.params.notificationId;

        const userId =
            req.user.user_id;


        const affectedRows =
            await markNotificationAsRead(
                notificationId,
                userId
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                message:
                    'Notification not found'
            });
        }


        res.status(200).json({

            message:
                'Notification marked as read'

        });


    } catch (error) {

        console.error(
            'Mark notification error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// MARK ALL AS READ
// ========================================

const markAllAsRead = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;


        const affectedRows =
            await markAllNotificationsAsRead(
                userId
            );


        res.status(200).json({

            message:
                'All notifications marked as read',

            updatedCount:
                affectedRows

        });


    } catch (error) {

        console.error(
            'Mark all notifications error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// UNREAD COUNT
// ========================================

const getUnreadCount = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;


        const count =
            await getUnreadNotificationCount(
                userId
            );


        res.status(200).json({

            unreadCount:
                Number(count)

        });


    } catch (error) {

        console.error(
            'Unread count error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};