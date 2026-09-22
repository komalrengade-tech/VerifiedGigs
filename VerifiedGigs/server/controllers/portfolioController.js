const {
    getStudentIdByUserId,
    createPortfolio,
    getStudentPortfolio,
    updatePortfolio,
    deletePortfolio
} = require('../models/portfolioModel');


// ========================================
// CREATE PORTFOLIO
// ========================================

const addPortfolio = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            title,
            description,
            projectUrl,
            githubUrl,
            imageUrl
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'Portfolio title is required'
            });
        }

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const portfolioId = await createPortfolio(
            student.student_id,
            title,
            description || null,
            projectUrl || null,
            githubUrl || null,
            imageUrl || null
        );

        res.status(201).json({
            message: 'Portfolio project added successfully',
            portfolioId
        });

    } catch (error) {

        console.error('Add portfolio error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET PORTFOLIO
// ========================================

const getPortfolio = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const portfolio = await getStudentPortfolio(
            student.student_id
        );

        res.status(200).json({
            portfolio
        });

    } catch (error) {

        console.error('Get portfolio error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// UPDATE PORTFOLIO
// ========================================

const editPortfolio = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const portfolioId = req.params.portfolioId;

        const {
            title,
            description,
            projectUrl,
            githubUrl,
            imageUrl
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'Portfolio title is required'
            });
        }

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const affectedRows = await updatePortfolio(
            portfolioId,
            student.student_id,
            title,
            description || null,
            projectUrl || null,
            githubUrl || null,
            imageUrl || null
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Portfolio project not found'
            });
        }

        res.status(200).json({
            message: 'Portfolio project updated successfully'
        });

    } catch (error) {

        console.error('Update portfolio error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// DELETE PORTFOLIO
// ========================================

const removePortfolio = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const portfolioId = req.params.portfolioId;

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const affectedRows = await deletePortfolio(
            portfolioId,
            student.student_id
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Portfolio project not found'
            });
        }

        res.status(200).json({
            message: 'Portfolio project deleted successfully'
        });

    } catch (error) {

        console.error('Delete portfolio error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addPortfolio,
    getPortfolio,
    editPortfolio,
    removePortfolio
};