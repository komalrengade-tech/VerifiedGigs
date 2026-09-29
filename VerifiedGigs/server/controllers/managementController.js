const managementModel = require('../models/managementModel');

const {
    getClientIdByUserId
} = require('../models/projectModel');

const {
    getAllGigsAdmin,
    deleteGigAdmin
} = require('../models/gigModel');


// ======================================================
// CLIENT DASHBOARD
// ======================================================

const clientDashboard = async (
    req,
    res
) => {

    try {

        const clientId =
            await getClientIdByUserId(
                req.user.user_id
            );

        if (!clientId) {

            return res.status(404).json({
                message: 'Client profile not found'
            });
        }

        res.status(200).json({

            stats:
                await managementModel
                    .getClientDashboardStats(
                        clientId
                    )

        });

    } catch (error) {

        console.error(
            'Client dashboard error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// CLIENT GIGS
// ======================================================

const clientGigs = async (
    req,
    res
) => {

    try {

        const clientId =
            await getClientIdByUserId(
                req.user.user_id
            );

        if (!clientId) {

            return res.status(404).json({
                message: 'Client profile not found'
            });
        }

        res.status(200).json({

            gigs:
                await managementModel
                    .getClientGigs(
                        clientId
                    )

        });

    } catch (error) {

        console.error(
            'Client gigs error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN DASHBOARD
// ======================================================

const adminDashboard = async (
    req,
    res
) => {

    try {

        res.status(200).json({

            stats:
                await managementModel
                    .getAdminDashboardStats()

        });

    } catch (error) {

        console.error(
            'Admin dashboard error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN USERS
// ======================================================

const adminUsers = async (
    req,
    res
) => {

    try {

        res.status(200).json({

            users:
                await managementModel
                    .getAdminUsers(
                        req.query.role
                    )

        });

    } catch (error) {

        console.error(
            'Admin users error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN USER DETAILS
// ======================================================

const adminUser = async (
    req,
    res
) => {

    try {

        const user =
            await managementModel.getAdminUser(
                req.params.userId
            );

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        console.error(
            'Admin user detail error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// CHANGE USER STATUS
// ======================================================

const changeUserStatus = async (
    req,
    res
) => {

    try {

        const allowed = [
            'ACTIVE',
            'INACTIVE',
            'SUSPENDED'
        ];

        if (
            !allowed.includes(
                req.body.status
            )
        ) {

            return res.status(400).json({
                message: 'Invalid account status'
            });
        }

        const affectedRows =
            await managementModel.updateUserStatus(
                req.params.userId,
                req.body.status
            );

        if (!affectedRows) {

            return res.status(404).json({
                message:
                    'User not found or cannot be modified'
            });
        }

        res.status(200).json({
            message:
                'User status updated successfully'
        });

    } catch (error) {

        console.error(
            'Admin user status error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN GIGS
// ======================================================

const adminGigs = async (
    req,
    res
) => {

    try {

        const gigs =
            await getAllGigsAdmin();

        res.status(200).json({
            gigs
        });

    } catch (error) {

        console.error(
            'Admin gigs error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN DELETE GIG
// ======================================================

const adminDeleteGig = async (
    req,
    res
) => {

    try {

        const result =
            await deleteGigAdmin(
                req.params.gigId
            );


        // ========================================
        // GIG NOT FOUND
        // ========================================

        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                message: 'Gig not found'
            });
        }


        // ========================================
        // SUCCESS
        // ========================================

        res.status(200).json({

            message:
                'Gig deleted successfully'

        });


    } catch (error) {

        if (
    error.code === 'ER_ROW_IS_REFERENCED_2' ||
    error.errno === 1451
) {
    console.log(
        `Admin attempted to delete gig ${req.params.gigId}, but it has associated applications or projects.`
    );

    return res.status(409).json({
        message:
            'Cannot delete this gig because it has applications or projects associated with it.'
    });
}

console.error('Admin delete gig error:', error);


        // ========================================
        // FOREIGN KEY CONSTRAINT
        // ========================================
        //
        // The gig has related applications/projects.
        // Do not force-delete it.
        // Return a meaningful response to frontend.
        // ========================================

        

        // ========================================
        // OTHER DATABASE/SERVER ERROR
        // ========================================

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN PROJECTS
// ======================================================

const adminProjects = async (
    req,
    res
) => {

    try {

        const projects =
            await managementModel
                .getAdminProjects();

        res.status(200).json({
            projects
        });

    } catch (error) {

        console.error(
            'Admin projects error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN PAYMENTS
// ======================================================

const adminPayments = async (
    req,
    res
) => {

    try {

        const payments =
            await managementModel
                .getAdminPayments();

        res.status(200).json({
            payments
        });

    } catch (error) {

        console.error(
            'Admin payments error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// ADMIN PROFILE
// ======================================================

const adminProfile = async (
    req,
    res
) => {

    try {

        const profile =
            await managementModel
                .getAdminProfile(
                    req.user.user_id
                );

        if (!profile) {

            return res.status(404).json({
                message:
                    'Admin profile not found'
            });
        }

        res.status(200).json({
            profile
        });

    } catch (error) {

        console.error(
            'Admin profile error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// UPDATE ADMIN PROFILE
// ======================================================

const updateAdminProfile = async (
    req,
    res
) => {

    try {

        const {
            name,
            phone,
            profilePicture
        } = req.body;


        if (
            !name ||
            !name.trim()
        ) {

            return res.status(400).json({
                message: 'Name is required'
            });
        }


        const affectedRows =
            await managementModel.updateAdminProfile(

                req.user.user_id,

                name.trim(),

                phone || null,

                profilePicture || null

            );


        if (!affectedRows) {

            return res.status(404).json({
                message:
                    'Admin profile not found'
            });
        }


        res.status(200).json({

            message:
                'Admin profile updated successfully'

        });

    } catch (error) {

        console.error(
            'Update admin profile error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

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

};
