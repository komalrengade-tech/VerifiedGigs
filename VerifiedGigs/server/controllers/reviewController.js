const {
    checkExistingReview,
    createReview,
    getProjectReviews,
    getUserReviews
} = require('../models/reviewModel');
const { getProjectParticipants } = require('../models/projectModel');


// ========================================
// CREATE REVIEW
// ========================================

const addReview = async (req, res) => {

    try {

        const projectId = req.params.projectId;

        const reviewerUserId = req.user.user_id;

        const participants = await getProjectParticipants(projectId);
        if (!participants) return res.status(404).json({ message: 'Project not found' });
        if (participants.project_status !== 'COMPLETED') {
            return res.status(400).json({ message: 'Reviews are available after project completion' });
        }
        if (Number(reviewerUserId) !== Number(participants.client_user_id) && Number(reviewerUserId) !== Number(participants.student_user_id)) {
            return res.status(403).json({ message: 'Only project participants can submit reviews' });
        }

        const {
            reviewedUserId,
            rating,
            reviewText
        } = req.body;


        // -------------------------------
        // Validate reviewed user
        // -------------------------------

        if (!reviewedUserId) {

            return res.status(400).json({
                message: 'Reviewed user ID is required'
            });
        }

        const participantIds = [Number(participants.client_user_id), Number(participants.student_user_id)];
        if (!participantIds.includes(Number(reviewedUserId)) || Number(reviewedUserId) === Number(reviewerUserId)) {
            return res.status(403).json({ message: 'Reviewed user is not a project participant' });
        }


        // -------------------------------
        // Prevent self-review
        // -------------------------------

        if (
            Number(reviewedUserId) ===
            Number(reviewerUserId)
        ) {

            return res.status(400).json({
                message: 'You cannot review yourself'
            });
        }


        // -------------------------------
        // Validate rating
        // -------------------------------

        if (
            !rating ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {

            return res.status(400).json({
                message: 'Rating must be between 1 and 5'
            });
        }


        // -------------------------------
        // Check duplicate review
        // -------------------------------

        const existingReview =
            await checkExistingReview(
                projectId,
                reviewerUserId,
                reviewedUserId
            );


        if (existingReview) {

            return res.status(409).json({
                message: 'You have already reviewed this user for this project'
            });
        }


        // -------------------------------
        // Create review
        // -------------------------------

        const reviewId = await createReview(
            projectId,
            reviewerUserId,
            reviewedUserId,
            rating,
            reviewText || null
        );


        res.status(201).json({

            message: 'Review submitted successfully',

            reviewId

        });


    } catch (error) {

        console.error(
            'Create review error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET PROJECT REVIEWS
// ========================================

const getReviewsForProject = async (
    req,
    res
) => {

    try {

        const projectId =
            req.params.projectId;


        const reviews =
            await getProjectReviews(
                projectId
            );


        res.status(200).json({
            reviews
        });


    } catch (error) {

        console.error(
            'Get project reviews error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET USER REVIEWS
// ========================================

const getReviewsForUser = async (
    req,
    res
) => {

    try {

        const userId =
            req.params.userId;


        const reviews =
            await getUserReviews(
                userId
            );


        res.status(200).json({
            reviews
        });


    } catch (error) {

        console.error(
            'Get user reviews error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addReview,
    getReviewsForProject,
    getReviewsForUser
};