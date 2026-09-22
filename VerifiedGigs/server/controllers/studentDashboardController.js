 const {
    getApplicationStats,
    getActiveProjectCount,
    getUnreadNotificationCount,
    getRecentApplications,
    getActiveProjects,
    getRecentNotifications
} = require('../models/studentDashboardModel');

const {
    getStudentProfile
} = require('../models/profileModel');


// ======================================================
// GET STUDENT DASHBOARD
// ======================================================

const getStudentDashboard = async (req, res) => {

    try {

        // ------------------------------------------------
        // STEP 1: Get logged-in user's ID from JWT
        // ------------------------------------------------

        const userId = req.user.user_id;


        // ------------------------------------------------
        // STEP 2: Get student profile
        // ------------------------------------------------

        const profile = await getStudentProfile(userId);


        // ------------------------------------------------
        // STEP 3: Check whether student profile exists
        // ------------------------------------------------

        if (!profile) {

            return res.status(404).json({
                message: 'Student profile not found'
            });
        }


        // ------------------------------------------------
        // STEP 4: Get student_id
        // ------------------------------------------------

        const studentId = profile.student_id;


        // ------------------------------------------------
        // STEP 5: Get dashboard data
        // ------------------------------------------------

        const [
            applicationStats,
            activeProjectCount,
            unreadNotificationCount,
            recentApplications,
            activeProjects,
            recentNotifications
        ] = await Promise.all([

            getApplicationStats(studentId),

            getActiveProjectCount(studentId),

            getUnreadNotificationCount(userId),

            getRecentApplications(studentId),

            getActiveProjects(studentId),

            getRecentNotifications(userId)

        ]);


        // ------------------------------------------------
        // STEP 6: Send response
        // ------------------------------------------------

        return res.status(200).json({

            profile,

            stats: {

                totalApplications:
                    applicationStats.totalApplications,

                pendingApplications:
                    applicationStats.pendingApplications,

                shortlistedApplications:
                    applicationStats.shortlistedApplications,

                acceptedApplications:
                    applicationStats.acceptedApplications,

                rejectedApplications:
                    applicationStats.rejectedApplications,

                withdrawnApplications:
                    applicationStats.withdrawnApplications,

                activeProjects:
                    activeProjectCount,

                unreadNotifications:
                    unreadNotificationCount

            },

            recentApplications,

            activeProjects,

            recentNotifications

        });

    } catch (error) {

        console.error(
            'Student dashboard error:',
            error
        );

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    getStudentDashboard
};