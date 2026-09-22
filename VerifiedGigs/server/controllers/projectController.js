const projectModel = require('../models/projectModel');
const { createNotification } = require('../models/notificationModel');
const { getUserIdByStudentId } = require('../models/userModel');


// ======================================================
// CREATE PROJECT — CLIENT
// ======================================================
const createProject = async (req, res) => {

    try {

        const {
            applicationId,
            projectTitle,
            agreedAmount,
            startDate,
            expectedEndDate
        } = req.body;


        // --------------------------------------------------
        // BASIC VALIDATION
        // --------------------------------------------------

        if (
            !applicationId ||
            !projectTitle ||
            agreedAmount === undefined ||
            !startDate ||
            !expectedEndDate
        ) {
            return res.status(400).json({
                message: 'All project fields are required'
            });
        }


        // --------------------------------------------------
        // GET CLIENT ID
        // --------------------------------------------------

        const clientId =
            await projectModel.getClientIdByUserId(req.user.user_id);


        if (!clientId) {
            return res.status(404).json({
                message: 'Client profile not found'
            });
        }


        // --------------------------------------------------
        // GET APPLICATION
        // --------------------------------------------------

        const application =
            await projectModel.getAcceptedApplication(
                applicationId,
                clientId
            );


        if (!application) {
            return res.status(404).json({
                message: 'Application not found or does not belong to this client'
            });
        }


        // --------------------------------------------------
        // APPLICATION MUST BE ACCEPTED
        // --------------------------------------------------

        if (application.application_status !== 'ACCEPTED') {

            return res.status(400).json({
                message: 'Project can only be created from an ACCEPTED application'
            });

        }


        // --------------------------------------------------
        // CHECK DUPLICATE PROJECT
        // --------------------------------------------------

        const existingProject =
            await projectModel.getProjectByApplicationId(
                applicationId
            );


        if (existingProject) {

            return res.status(409).json({
                message: 'A project already exists for this application',
                projectId: existingProject.project_id
            });

        }


        // --------------------------------------------------
        // VALIDATE AMOUNT
        // --------------------------------------------------

        if (Number(agreedAmount) < 0) {

            return res.status(400).json({
                message: 'Agreed amount cannot be negative'
            });

        }


        // --------------------------------------------------
        // CREATE PROJECT
        // --------------------------------------------------

        const projectId =
            await projectModel.createProject(
                applicationId,
                application.student_id,
                clientId,
                projectTitle,
                agreedAmount,
                startDate,
                expectedEndDate
            );


        // --------------------------------------------------
        // NOTIFY STUDENT
        // --------------------------------------------------

        try {

            const studentUserId = await getUserIdByStudentId(application.student_id);

            if (studentUserId) {

                await createNotification(
                    studentUserId,
                    'New project started',
                    `A client has created the project "${projectTitle}" from your accepted application.`,
                    'PROJECT',
                    projectId
                );
            }

        } catch (notifyError) {

            console.error('Project creation notification error:', notifyError);
        }


        return res.status(201).json({
            message: 'Project created successfully',
            projectId
        });

    } catch (error) {

        console.error('Create project error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// GET CLIENT PROJECTS
// ======================================================
const getClientProjects = async (req, res) => {

    try {

        const clientId =
            await projectModel.getClientIdByUserId(req.user.user_id);


        if (!clientId) {
            return res.status(404).json({
                message: 'Client profile not found'
            });
        }


        const projects =
            await projectModel.getProjectsByClient(clientId);


        return res.status(200).json({
            projects
        });

    } catch (error) {

        console.error('Get client projects error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// GET SINGLE CLIENT PROJECT
// ======================================================
const getClientProject = async (req, res) => {

    try {

        const { projectId } = req.params;


        const clientId =
            await projectModel.getClientIdByUserId(req.user.user_id);


        if (!clientId) {
            return res.status(404).json({
                message: 'Client profile not found'
            });
        }


        const project =
            await projectModel.getClientProject(
                projectId,
                clientId
            );


        if (!project) {

            return res.status(404).json({
                message: 'Project not found'
            });

        }


        return res.status(200).json({
            project
        });

    } catch (error) {

        console.error('Get client project error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// GET STUDENT PROJECTS
// ======================================================
const getStudentProjects = async (req, res) => {

    try {

        const [rows] = await require('../config/db').query(
            `SELECT student_id
             FROM students
             WHERE user_id = ?`,
            [req.user.user_id]
        );


        if (!rows.length) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }


        const projects =
            await projectModel.getProjectsByStudent(
                rows[0].student_id
            );


        return res.status(200).json({
            projects
        });

    } catch (error) {

        console.error('Get student projects error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// GET SINGLE STUDENT PROJECT
// ======================================================
const getStudentProject = async (req, res) => {

    try {

        const { projectId } = req.params;


        const [rows] = await require('../config/db').query(
            `SELECT student_id
             FROM students
             WHERE user_id = ?`,
            [req.user.user_id]
        );


        if (!rows.length) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }


        const project =
            await projectModel.getStudentProject(
                projectId,
                rows[0].student_id
            );


        if (!project) {

            return res.status(404).json({
                message: 'Project not found'
            });

        }


        return res.status(200).json({
            project
        });

    } catch (error) {

        console.error('Get student project error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


// ======================================================
// UPDATE PROJECT STATUS — CLIENT
// ======================================================
const updateProjectStatus = async (req, res) => {

    try {

        const { projectId } = req.params;
        const { status } = req.body;


        const allowedStatuses = [
            'NOT_STARTED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED',
            'DISPUTED'
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: 'Invalid project status'
            });

        }


        const clientId =
            await projectModel.getClientIdByUserId(req.user.user_id);


        if (!clientId) {
            return res.status(404).json({
                message: 'Client profile not found'
            });
        }


        const updated =
            await projectModel.updateProjectStatus(
                projectId,
                clientId,
                status
            );


        if (!updated) {

            return res.status(404).json({
                message: 'Project not found or does not belong to this client'
            });

        }


        // --------------------------------------------------
        // NOTIFY STUDENT OF STATUS CHANGE
        // --------------------------------------------------

        try {

            const participants = await projectModel.getProjectParticipants(projectId);

            if (participants?.student_user_id) {

                await createNotification(
                    participants.student_user_id,
                    'Project status updated',
                    `Your project status changed to ${status.replace('_', ' ')}.`,
                    'PROJECT',
                    Number(projectId)
                );
            }

        } catch (notifyError) {

            console.error('Project status notification error:', notifyError);
        }


        return res.status(200).json({
            message: 'Project status updated successfully'
        });

    } catch (error) {

        console.error('Update project status error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    createProject,
    getClientProjects,
    getClientProject,
    getStudentProjects,
    getStudentProject,
    updateProjectStatus
};