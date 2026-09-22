const {
    getStudentIdByUserId,
    checkExistingApplication,
    createApplication,
    getStudentApplications,
    getStudentApplicationById,
    withdrawApplication,

    getClientIdByUserId,
    getClientApplications,
    getClientApplicationById,
    updateApplicationStatus,

    getGigOwnerByGigId,
    getApplicantByApplicationId
} = require('../models/applicationModel');
const { createNotification } = require('../models/notificationModel');

const STATUS_MESSAGES = {
    SHORTLISTED: 'has shortlisted your application for',
    ACCEPTED: 'has accepted your application for',
    REJECTED: 'has declined your application for'
};


// ======================================================
// STUDENT — APPLY TO GIG
// ======================================================

const applyToGig = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            gigId,
            coverLetter,
            proposedPrice,
            estimatedDays
        } = req.body;


        // ------------------------------------------------
        // Validate
        // ------------------------------------------------

        if (
            !gigId ||
            !coverLetter ||
            !proposedPrice ||
            !estimatedDays
        ) {

            return res.status(400).json({
                message:
                    'gigId, coverLetter, proposedPrice and estimatedDays are required'
            });
        }


        // ------------------------------------------------
        // Get student ID
        // ------------------------------------------------

        const student =
            await getStudentIdByUserId(userId);


        if (!student) {

            return res.status(404).json({
                message:
                    'Student profile not found'
            });
        }


        const studentId =
            student.student_id;


        // ------------------------------------------------
        // Check duplicate application
        // ------------------------------------------------

        const existing =
            await checkExistingApplication(
                gigId,
                studentId
            );


        if (existing) {

            return res.status(409).json({
                message:
                    'You have already applied to this gig'
            });
        }


        // ------------------------------------------------
        // Create application
        // ------------------------------------------------

        const result =
            await createApplication(

                gigId,

                studentId,

                coverLetter,

                proposedPrice,

                estimatedDays

            );


        // ------------------------------------------------
        // Notify the client that owns the gig
        // ------------------------------------------------

        try {

            const owner = await getGigOwnerByGigId(gigId);

            if (owner) {

                await createNotification(
                    owner.owner_user_id,
                    'New application received',
                    `A student has applied to your gig "${owner.gig_title}".`,
                    'APPLICATION',
                    result.insertId
                );
            }

        } catch (notifyError) {

            console.error(
                'Application notification error:',
                notifyError
            );
        }


        return res.status(201).json({

            message:
                'Application submitted successfully',

            applicationId:
                result.insertId

        });

    } catch (error) {

        console.error(
            'Apply to gig error:',
            error
        );

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// STUDENT — GET APPLICATIONS
// ======================================================

const getMyApplications = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;


        const student =
            await getStudentIdByUserId(
                userId
            );


        if (!student) {

            return res.status(404).json({
                message:
                    'Student profile not found'
            });
        }


        const applications =
            await getStudentApplications(
                student.student_id
            );


        res.status(200).json({
            applications
        });

    } catch (error) {

        console.error(
            'Get student applications error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// STUDENT — GET SINGLE APPLICATION
// ======================================================

const getMyApplication = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const applicationId =
            req.params.applicationId;


        const student =
            await getStudentIdByUserId(
                userId
            );


        if (!student) {

            return res.status(404).json({
                message:
                    'Student profile not found'
            });
        }


        const application =
            await getStudentApplicationById(

                applicationId,

                student.student_id

            );


        if (!application) {

            return res.status(404).json({
                message:
                    'Application not found'
            });
        }


        res.status(200).json({
            application
        });

    } catch (error) {

        console.error(
            'Get application error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// STUDENT — WITHDRAW APPLICATION
// ======================================================

const withdrawMyApplication = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const applicationId =
            req.params.applicationId;


        const student =
            await getStudentIdByUserId(
                userId
            );


        if (!student) {

            return res.status(404).json({
                message:
                    'Student profile not found'
            });
        }


        const result =
            await withdrawApplication(

                applicationId,

                student.student_id

            );


        if (result.affectedRows === 0) {

            return res.status(400).json({

                message:
                    'Application cannot be withdrawn or does not belong to you'

            });
        }


        res.status(200).json({

            message:
                'Application withdrawn successfully'

        });

    } catch (error) {

        console.error(
            'Withdraw application error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// CLIENT — GET APPLICATIONS
// ======================================================

const getClientApplicationList = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;


        const client =
            await getClientIdByUserId(
                userId
            );


        if (!client) {

            return res.status(404).json({
                message:
                    'Client profile not found'
            });
        }


        const applications =
            await getClientApplications(
                client.client_id
            );


        res.status(200).json({
            applications
        });

    } catch (error) {

        console.error(
            'Get client applications error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// CLIENT — GET SINGLE APPLICATION
// ======================================================

const getClientApplication = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const applicationId =
            req.params.applicationId;


        const client =
            await getClientIdByUserId(
                userId
            );


        if (!client) {

            return res.status(404).json({
                message:
                    'Client profile not found'
            });
        }


        const application =
            await getClientApplicationById(

                applicationId,

                client.client_id

            );


        if (!application) {

            return res.status(404).json({
                message:
                    'Application not found'
            });
        }


        res.status(200).json({
            application
        });

    } catch (error) {

        console.error(
            'Get client application error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// CLIENT — UPDATE APPLICATION STATUS
// ======================================================

const changeApplicationStatus = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.user_id;

        const applicationId =
            req.params.applicationId;

        const {
            status
        } = req.body;


        // ------------------------------------------------
        // Validate status
        // ------------------------------------------------

        const allowedStatuses = [

            'PENDING',
            'SHORTLISTED',
            'ACCEPTED',
            'REJECTED',
            'WITHDRAWN'

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    'Invalid application status'

            });
        }


        // ------------------------------------------------
        // Get client
        // ------------------------------------------------

        const client =
            await getClientIdByUserId(
                userId
            );


        if (!client) {

            return res.status(404).json({
                message:
                    'Client profile not found'
            });
        }


        // ------------------------------------------------
        // Update
        // ------------------------------------------------

        const result =
            await updateApplicationStatus(

                applicationId,

                client.client_id,

                status

            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Application not found or you do not own this gig'

            });
        }


        // ------------------------------------------------
        // Notify the applicant of the status change
        // ------------------------------------------------

        try {

            if (STATUS_MESSAGES[status]) {

                const applicant = await getApplicantByApplicationId(applicationId);

                if (applicant) {

                    await createNotification(
                        applicant.applicant_user_id,
                        `Application ${status.toLowerCase()}`,
                        `A client ${STATUS_MESSAGES[status]} "${applicant.gig_title}".`,
                        'APPLICATION',
                        Number(applicationId)
                    );
                }
            }

        } catch (notifyError) {

            console.error(
                'Application status notification error:',
                notifyError
            );
        }


        res.status(200).json({

            message:
                'Application status updated successfully'

        });

    } catch (error) {

        console.error(
            'Update application status error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    applyToGig,

    getMyApplications,

    getMyApplication,

    withdrawMyApplication,

    getClientApplicationList,

    getClientApplication,

    changeApplicationStatus

};