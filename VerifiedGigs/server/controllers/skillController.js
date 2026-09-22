const {
    getStudentIdByUserId,
    getAllSkills,
    createSkill,
    addStudentSkill,
    getStudentSkills,
    updateStudentSkill,
    deleteStudentSkill
} = require('../models/skillModel');


// ========================================
// GET ALL AVAILABLE SKILLS
// ========================================

const getSkills = async (req, res) => {

    try {

        const skills = await getAllSkills();

        res.status(200).json({
            skills
        });

    } catch (error) {

        console.error('Get skills error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// CREATE SKILL
// ========================================

const createNewSkill = async (req, res) => {

    try {

        const {
            skillName,
            category,
            description
        } = req.body;

        if (!skillName) {
            return res.status(400).json({
                message: 'Skill name is required'
            });
        }

        const skillId = await createSkill(
            skillName,
            category || null,
            description || null
        );

        res.status(201).json({
            message: 'Skill created successfully',
            skillId
        });

    } catch (error) {

        console.error('Create skill error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Skill already exists'
            });
        }

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// ADD SKILL TO STUDENT
// ========================================

const addSkill = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            skillId,
            proficiencyLevel,
            yearsOfExperience
        } = req.body;

        if (!skillId) {
            return res.status(400).json({
                message: 'skillId is required'
            });
        }

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const studentSkillId = await addStudentSkill(
            student.student_id,
            skillId,
            proficiencyLevel || null,
            yearsOfExperience || null
        );

        res.status(201).json({
            message: 'Skill added successfully',
            studentSkillId
        });

    } catch (error) {

        console.error('Add skill error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Student already has this skill'
            });
        }

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET STUDENT SKILLS
// ========================================

const studentSkills = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const skills = await getStudentSkills(
            student.student_id
        );

        res.status(200).json({
            skills
        });

    } catch (error) {

        console.error('Student skills error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// UPDATE STUDENT SKILL
// ========================================

const updateSkill = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const skillId = req.params.skillId;

        const {
            proficiencyLevel,
            yearsOfExperience
        } = req.body;

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const affectedRows = await updateStudentSkill(
            student.student_id,
            skillId,
            proficiencyLevel || null,
            yearsOfExperience || null
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Student skill not found'
            });
        }

        res.status(200).json({
            message: 'Skill updated successfully'
        });

    } catch (error) {

        console.error('Update skill error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// DELETE STUDENT SKILL
// ========================================

const deleteSkill = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const skillId = req.params.skillId;

        const student = await getStudentIdByUserId(userId);

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        const affectedRows = await deleteStudentSkill(
            student.student_id,
            skillId
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Student skill not found'
            });
        }

        res.status(200).json({
            message: 'Skill deleted successfully'
        });

    } catch (error) {

        console.error('Delete skill error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    getSkills,
    createNewSkill,
    addSkill,
    studentSkills,
    updateSkill,
    deleteSkill
};