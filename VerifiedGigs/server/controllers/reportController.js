const {
    createReport,
    getMyReports,
    getAllReports,
    getReportById,
    updateReportStatus
} = require('../models/reportModel');
const { createNotification } = require('../models/notificationModel');


// ========================================
// CREATE REPORT
// ========================================

const addReport = async (req, res) => {

    try {

        const reporterId =
            req.user.user_id;

        const {
            reportedUserId,
            gigId,
            projectId,
            reason,
            description
        } = req.body;


        if (!reason) {

            return res.status(400).json({
                message: 'Reason is required'
            });
        }


        // At least one target must exist
        if (
            !reportedUserId &&
            !gigId &&
            !projectId
        ) {

            return res.status(400).json({

                message:
                    'Report must be associated with a user, gig, or project'

            });
        }


        const reportId =
            await createReport(
                reporterId,
                reportedUserId,
                gigId,
                projectId,
                reason,
                description
            );


        res.status(201).json({

            message:
                'Report submitted successfully',

            reportId

        });


    } catch (error) {

        console.error(
            'Create report error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET MY REPORTS
// ========================================

const getMyReportList = async (
    req,
    res
) => {

    try {

        const reporterId =
            req.user.user_id;


        const reports =
            await getMyReports(
                reporterId
            );


        res.status(200).json({
            reports
        });


    } catch (error) {

        console.error(
            'Get my reports error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET ALL REPORTS
// ADMIN
// ========================================

const getReportList = async (
    req,
    res
) => {

    try {

        const reports =
            await getAllReports();


        res.status(200).json({
            reports
        });


    } catch (error) {

        console.error(
            'Get all reports error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET REPORT BY ID
// ADMIN
// ========================================

const getReport = async (
    req,
    res
) => {

    try {

        const reportId =
            req.params.reportId;


        const report =
            await getReportById(
                reportId
            );


        if (!report) {

            return res.status(404).json({
                message: 'Report not found'
            });
        }


        res.status(200).json({
            report
        });


    } catch (error) {

        console.error(
            'Get report error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// UPDATE REPORT STATUS
// ADMIN
// ========================================

const changeReportStatus = async (
    req,
    res
) => {

    try {

        const reportId =
            req.params.reportId;

        const {
            status
        } = req.body;

        const adminId =
            req.user.user_id;


        const allowedStatuses = [
            'PENDING',
            'UNDER_REVIEW',
            'RESOLVED',
            'REJECTED'
        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    'Invalid report status'

            });
        }


        const affectedRows =
            await updateReportStatus(
                reportId,
                status,
                adminId
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Report not found'
            });
        }


        // --------------------------------------------------
        // NOTIFY REPORTER
        // --------------------------------------------------

        try {

            const report = await getReportById(reportId);

            if (report?.reporter_id) {

                await createNotification(
                    report.reporter_id,
                    'Report status updated',
                    `Your report "${report.reason}" is now ${status.replace('_', ' ').toLowerCase()}.`,
                    'REPORT',
                    Number(reportId)
                );
            }

        } catch (notifyError) {

            console.error('Report status notification error:', notifyError);
        }


        res.status(200).json({

            message:
                'Report status updated successfully'

        });


    } catch (error) {

        console.error(
            'Update report status error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addReport,
    getMyReportList,
    getReportList,
    getReport,
    changeReportStatus
};