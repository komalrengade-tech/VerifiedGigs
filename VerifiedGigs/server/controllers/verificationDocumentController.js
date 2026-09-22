const {
    createVerificationDocument,
    getMyVerificationDocuments,
    getAllVerificationDocuments,
    getPendingVerificationDocuments,
    getVerificationDocumentById,
    verifyDocument,
    rejectDocument
} = require('../models/verificationDocumentModel');
const { getStudentProfile } = require('../models/profileModel');
const { createNotification } = require('../models/notificationModel');
const { getUserIdByStudentId } = require('../models/userModel');


// ========================================
// STUDENT → UPLOAD DOCUMENT
// ========================================

const uploadVerificationDocument = async (
    req,
    res
) => {

    try {

        const profile = await getStudentProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = profile.student_id;

        const {
            documentType,
            documentUrl
        } = req.body;


        if (!documentType) {

            return res.status(400).json({
                message: 'Document type is required'
            });
        }


        if (!documentUrl) {

            return res.status(400).json({
                message: 'Document URL is required'
            });
        }


        const documentId =
            await createVerificationDocument(
                studentId,
                documentType,
                documentUrl
            );


        res.status(201).json({

            message:
                'Verification document uploaded successfully',

            documentId,

            verificationStatus:
                'PENDING'
        });


    } catch (error) {

        console.error(
            'Upload verification document error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// STUDENT → MY DOCUMENTS
// ========================================

const getMyDocuments = async (
    req,
    res
) => {

    try {

        const profile = await getStudentProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = profile.student_id;


        const documents =
            await getMyVerificationDocuments(
                studentId
            );


        res.status(200).json({
            documents
        });


    } catch (error) {

        console.error(
            'Get my verification documents error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// ADMIN → ALL DOCUMENTS
// ========================================

const getDocumentList = async (
    req,
    res
) => {

    try {

        const documents =
            await getAllVerificationDocuments();


        res.status(200).json({
            documents
        });


    } catch (error) {

        console.error(
            'Get all verification documents error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// ADMIN → PENDING DOCUMENTS
// ========================================

const getPendingDocuments = async (
    req,
    res
) => {

    try {

        const documents =
            await getPendingVerificationDocuments();


        res.status(200).json({
            documents
        });


    } catch (error) {

        console.error(
            'Get pending verification documents error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// ADMIN → SINGLE DOCUMENT
// ========================================

const getDocument = async (
    req,
    res
) => {

    try {

        const documentId =
            req.params.documentId;


        const document =
            await getVerificationDocumentById(
                documentId
            );


        if (!document) {

            return res.status(404).json({
                message: 'Verification document not found'
            });
        }


        res.status(200).json({
            document
        });


    } catch (error) {

        console.error(
            'Get verification document error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// ADMIN → VERIFY DOCUMENT
// ========================================

const approveDocument = async (
    req,
    res
) => {

    try {

        const documentId =
            req.params.documentId;

        const adminId =
            req.user.user_id;


        const affectedRows =
            await verifyDocument(
                documentId,
                adminId
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Verification document not found'
            });
        }


        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const document = await getVerificationDocumentById(documentId);
            const studentUserId = document ? await getUserIdByStudentId(document.student_id) : null;

            if (studentUserId) {

                await createNotification(
                    studentUserId,
                    'Verification approved',
                    `Your ${document.document_type} document was approved.`,
                    'VERIFICATION',
                    Number(documentId)
                );
            }

        } catch (notifyError) {

            console.error('Verification approval notification error:', notifyError);
        }


        res.status(200).json({

            message:
                'Verification document approved successfully'

        });


    } catch (error) {

        console.error(
            'Approve verification document error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// ADMIN → REJECT DOCUMENT
// ========================================

const rejectVerificationDocument = async (
    req,
    res
) => {

    try {

        const documentId =
            req.params.documentId;

        const adminId =
            req.user.user_id;

        const {
            rejectionReason
        } = req.body;


        if (!rejectionReason) {

            return res.status(400).json({

                message:
                    'Rejection reason is required'

            });
        }


        const affectedRows =
            await rejectDocument(
                documentId,
                adminId,
                rejectionReason
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Verification document not found'
            });
        }


        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const document = await getVerificationDocumentById(documentId);
            const studentUserId = document ? await getUserIdByStudentId(document.student_id) : null;

            if (studentUserId) {

                await createNotification(
                    studentUserId,
                    'Verification rejected',
                    `Your ${document.document_type} document was rejected. Reason: ${rejectionReason}`,
                    'VERIFICATION',
                    Number(documentId)
                );
            }

        } catch (notifyError) {

            console.error('Verification rejection notification error:', notifyError);
        }


        res.status(200).json({

            message:
                'Verification document rejected successfully'

        });


    } catch (error) {

        console.error(
            'Reject verification document error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    uploadVerificationDocument,
    getMyDocuments,
    getDocumentList,
    getPendingDocuments,
    getDocument,
    approveDocument,
    rejectVerificationDocument
};