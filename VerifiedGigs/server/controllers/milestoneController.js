const {
    createMilestone,
    getProjectMilestones,
    getMilestoneById,
    updateMilestone,
    completeMilestone,
    deleteMilestone
} = require('../models/milestoneModel');
const { getProjectAccess } = require('../models/projectModel');
const { createNotification } = require('../models/notificationModel');

const requireClientProject = async (req, res, projectId) => {
    const access = await getProjectAccess(projectId, req.user.user_id);
    if (!access) {
        res.status(404).json({ message: 'Project not found or access denied' });
        return false;
    }
    if (Number(access.client_user_id) !== Number(req.user.user_id)) {
        res.status(403).json({ message: 'Only the project client can modify milestones' });
        return false;
    }
    return true;
};


// ========================================
// CREATE
// ========================================

const addMilestone = async (req, res) => {

    try {

        const projectId = req.params.projectId;

        if (!await requireClientProject(req, res, projectId)) return;

        const {
            title,
            description,
            amount,
            dueDate
        } = req.body;

        if (!title || !amount || !dueDate) {
            return res.status(400).json({
                message: 'Title, amount and due date are required'
            });
        }

        const milestoneId = await createMilestone(
            projectId,
            title,
            description || null,
            amount,
            dueDate
        );

        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const access = await getProjectAccess(projectId, req.user.user_id);

            if (access?.student_user_id) {

                await createNotification(
                    access.student_user_id,
                    'New milestone added',
                    `A new milestone "${title}" was added to your project.`,
                    'MILESTONE',
                    milestoneId
                );
            }

        } catch (notifyError) {

            console.error('Milestone notification error:', notifyError);
        }

        res.status(201).json({
            message: 'Milestone created successfully',
            milestoneId
        });

    } catch (error) {

        console.error('Create milestone error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET MILESTONES
// ========================================

const getMilestones = async (req, res) => {

    try {

        const projectId = req.params.projectId;

        if (!await getProjectAccess(projectId, req.user.user_id)) {
            return res.status(404).json({ message: 'Project not found or access denied' });
        }

        const milestones = await getProjectMilestones(projectId);

        res.status(200).json({
            milestones
        });

    } catch (error) {

        console.error('Get milestones error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// UPDATE
// ========================================

const editMilestone = async (req, res) => {

    try {

        const milestoneId = req.params.milestoneId;

        const milestone = await getMilestoneById(milestoneId);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        if (!await requireClientProject(req, res, milestone.project_id)) return;

        const {
            title,
            description,
            amount,
            dueDate
        } = req.body;

        const affectedRows = await updateMilestone(
            milestoneId,
            title,
            description || null,
            amount,
            dueDate
        );

        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Milestone not found'
            });

        }

        res.status(200).json({
            message: 'Milestone updated successfully'
        });

    } catch (error) {

        console.error('Update milestone error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// COMPLETE
// ========================================

const markCompleted = async (req, res) => {

    try {

        const milestoneId = req.params.milestoneId;

        const milestone = await getMilestoneById(milestoneId);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        if (!await requireClientProject(req, res, milestone.project_id)) return;

        const affectedRows = await completeMilestone(
            milestoneId
        );

        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Milestone not found'
            });

        }

        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const access = await getProjectAccess(milestone.project_id, req.user.user_id);

            if (access?.student_user_id) {

                await createNotification(
                    access.student_user_id,
                    'Milestone completed',
                    `Your milestone "${milestone.title}" was marked as completed.`,
                    'MILESTONE',
                    Number(milestoneId)
                );
            }

        } catch (notifyError) {

            console.error('Milestone completion notification error:', notifyError);
        }

        res.status(200).json({
            message: 'Milestone marked as completed'
        });

    } catch (error) {

        console.error('Complete milestone error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// DELETE
// ========================================

const removeMilestone = async (req, res) => {

    try {

        const milestoneId = req.params.milestoneId;

        const milestone = await getMilestoneById(milestoneId);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        if (!await requireClientProject(req, res, milestone.project_id)) return;

        const affectedRows = await deleteMilestone(
            milestoneId
        );

        if (affectedRows === 0) {

            return res.status(404).json({
                message: 'Milestone not found'
            });

        }

        res.status(200).json({
            message: 'Milestone deleted successfully'
        });

    } catch (error) {

        console.error('Delete milestone error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addMilestone,
    getMilestones,
    editMilestone,
    markCompleted,
    removeMilestone
};