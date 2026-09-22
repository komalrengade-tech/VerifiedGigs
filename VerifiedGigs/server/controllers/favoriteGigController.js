const {
    addFavorite,
    removeFavorite,
    getStudentFavorites,
    checkFavorite
} = require('../models/favoriteGigModel');
const { getStudentProfile } = require('../models/profileModel');


// ========================================
// ADD FAVORITE
// ========================================

const saveGig = async (req, res) => {

    try {

        const profile = await getStudentProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = profile.student_id;

        const gigId =
            req.params.gigId;


        await addFavorite(
            studentId,
            gigId
        );


        res.status(201).json({

            message:
                'Gig added to favorites successfully'

        });


    } catch (error) {

        console.error(
            'Add favorite error:',
            error
        );


        // Composite primary key
        // prevents duplicate favorites

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({

                message:
                    'Gig is already in your favorites'

            });
        }


        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// REMOVE FAVORITE
// ========================================

const unsaveGig = async (req, res) => {

    try {

        const profile = await getStudentProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = profile.student_id;

        const gigId =
            req.params.gigId;


        const affectedRows =
            await removeFavorite(
                studentId,
                gigId
            );


        if (affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Gig is not in your favorites'

            });
        }


        res.status(200).json({

            message:
                'Gig removed from favorites successfully'

        });


    } catch (error) {

        console.error(
            'Remove favorite error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET MY FAVORITES
// ========================================

const getMyFavorites = async (req, res) => {

    try {

        const profile = await getStudentProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = profile.student_id;


        const favorites =
            await getStudentFavorites(
                studentId
            );


        res.status(200).json({
            favorites
        });


    } catch (error) {

        console.error(
            'Get favorites error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// CHECK IF GIG IS FAVORITE
// ========================================

const checkIfFavorite = async (req, res) => {

    try {

        const profile = await getStudentProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = profile.student_id;

        const gigId =
            req.params.gigId;


        const favorite =
            await checkFavorite(
                studentId,
                gigId
            );


        res.status(200).json({

            isFavorite:
                !!favorite

        });


    } catch (error) {

        console.error(
            'Check favorite error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    saveGig,
    unsaveGig,
    getMyFavorites,
    checkIfFavorite
};