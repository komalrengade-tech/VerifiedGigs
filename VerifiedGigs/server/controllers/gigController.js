const {
    getAllGigs,
    getGigById,
    getClientIdByUserId,
    createGig,
    updateGig,
    deleteGig
} = require('../models/gigModel');


// ======================================================
// GET ALL GIGS
// ======================================================

const getGigs = async (req, res) => {

    try {

        const gigs = await getAllGigs();

        res.status(200).json({
            gigs
        });

    } catch (error) {

        console.error(
            'Get gigs error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// GET SINGLE GIG
// ======================================================

const getGig = async (req, res) => {

    try {

        const gigId = req.params.gigId;

        const gig = await getGigById(gigId);


        if (!gig) {

            return res.status(404).json({
                message: 'Gig not found'
            });
        }


        res.status(200).json({
            gig
        });

    } catch (error) {

        console.error(
            'Get gig error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// CREATE GIG
// ======================================================

const addGig = async (req, res) => {

    try {

        const userId = req.user.user_id;


        const {
            categoryId,
            title,
            description,
            budgetMin,
            budgetMax,
            deadline,
            requiredExperience
        } = req.body;


        // ----------------------------------------------
        // Validate required fields
        // ----------------------------------------------

        if (
            !categoryId ||
            !title ||
            !description
        ) {

            return res.status(400).json({
                message:
                    'categoryId, title and description are required'
            });
        }


        // ----------------------------------------------
        // Find client using JWT user_id
        // ----------------------------------------------

        const client =
            await getClientIdByUserId(userId);


        if (!client) {

            return res.status(404).json({
                message:
                    'Client profile not found'
            });
        }


        const clientId =
            client.client_id;


        // ----------------------------------------------
        // Create gig
        // ----------------------------------------------

        const result = await createGig(

            clientId,

            categoryId,

            title,

            description,

            budgetMin || null,

            budgetMax || null,

            deadline || null,

            requiredExperience || null

        );


        res.status(201).json({

            message: 'Gig created successfully',

            gigId: result.insertId

        });

    } catch (error) {

        console.error(
            'Create gig error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// UPDATE GIG
// ======================================================

const editGig = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const gigId = req.params.gigId;


        const {
            categoryId,
            title,
            description,
            budgetMin,
            budgetMax,
            deadline,
            requiredExperience,
            status
        } = req.body;


        // ----------------------------------------------
        // Find client
        // ----------------------------------------------

        const client =
            await getClientIdByUserId(userId);


        if (!client) {

            return res.status(404).json({
                message:
                    'Client profile not found'
            });
        }


        const clientId =
            client.client_id;


        // ----------------------------------------------
        // Update only own gig
        // ----------------------------------------------

        const result = await updateGig(

            gigId,

            clientId,

            categoryId,

            title,

            description,

            budgetMin || null,

            budgetMax || null,

            deadline || null,

            requiredExperience || null,

            status

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Gig not found or you do not own this gig'

            });
        }


        res.status(200).json({

            message:
                'Gig updated successfully'

        });

    } catch (error) {

        console.error(
            'Update gig error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// DELETE GIG
// ======================================================

const removeGig = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const gigId = req.params.gigId;


        // ----------------------------------------------
        // Find client
        // ----------------------------------------------

        const client =
            await getClientIdByUserId(userId);


        if (!client) {

            return res.status(404).json({
                message:
                    'Client profile not found'
            });
        }


        const clientId =
            client.client_id;


        // ----------------------------------------------
        // Delete own gig
        // ----------------------------------------------

        const result =
            await deleteGig(
                gigId,
                clientId
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    'Gig not found or you do not own this gig'

            });
        }


        res.status(200).json({

            message:
                'Gig deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete gig error:',
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

    getGigs,
    getGig,
    addGig,
    editGig,
    removeGig

};