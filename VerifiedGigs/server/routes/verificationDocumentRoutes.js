const express = require('express');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    uploadVerificationDocument,
    getMyDocuments,
    getDocumentList,
    getPendingDocuments,
    getDocument,
    approveDocument,
    rejectVerificationDocument
} = require('../controllers/verificationDocumentController');

const router = express.Router();


// ========================================
// STUDENT → UPLOAD DOCUMENT
// ========================================

router.post(
    '/verification-documents',
    authenticateToken,
    authorizeRoles('STUDENT'),
    uploadVerificationDocument
);


// ========================================
// STUDENT → MY DOCUMENTS
// ========================================

router.get(
    '/verification-documents/my',
    authenticateToken,
    authorizeRoles('STUDENT'),
    getMyDocuments
);


// ========================================
// ADMIN → ALL DOCUMENTS
// ========================================

router.get(
    '/verification-documents',
    authenticateToken,
    authorizeRoles('ADMIN'),
    getDocumentList
);


// ========================================
// ADMIN → PENDING DOCUMENTS
// ========================================

router.get(
    '/verification-documents/pending',
    authenticateToken,
    authorizeRoles('ADMIN'),
    getPendingDocuments
);


// ========================================
// ADMIN → SINGLE DOCUMENT
// ========================================

router.get(
    '/verification-documents/:documentId',
    authenticateToken,
    authorizeRoles('ADMIN'),
    getDocument
);


// ========================================
// ADMIN → APPROVE DOCUMENT
// ========================================

router.put(
    '/verification-documents/:documentId/approve',
    authenticateToken,
    authorizeRoles('ADMIN'),
    approveDocument
);


// ========================================
// ADMIN → REJECT DOCUMENT
// ========================================

router.put(
    '/verification-documents/:documentId/reject',
    authenticateToken,
    authorizeRoles('ADMIN'),
    rejectVerificationDocument
);


module.exports = router;