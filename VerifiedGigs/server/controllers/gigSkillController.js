const {
    addSkillToGig,
    getGigSkills,
    removeSkillFromGig
} = require('../models/gigSkillModel');


// ========================================
// ADD SKILL TO GIG
// ========================================

const addSkill = async (req, res) => {

    try {

        const gigId =
            req.params.gigId;

        const {
            skillId,
            importanceLevel
        } = req.body;


        if (!skillId) {

            return res.status(400).json({
                message: 'Skill ID is required'
            });
        }


        await addSkillToGig(
            gigId,
            skillId,
            importanceLevel
        );


        res.status(201).json({

            message:
                'Skill added to gig successfully'

        });

    } catch (error) {

        console.error(
            'Add gig skill error:',
            error
        );

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({
                message:
                    'Skill is already added to this gig'
            });
        }

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// GET GIG SKILLS
// ========================================

const getSkills = async (req, res) => {

    try {

        const gigId =
            req.params.gigId;


        const skills =
            await getGigSkills(
                gigId
            );


        res.status(200).json({
            skills
        });

    } catch (error) {

        console.error(
            'Get gig skills error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ========================================
// REMOVE GIG SKILL
// ========================================

const removeSkill = async (req, res) => {

    try {

        const {
            gigId,
            skillId
        } = req.params;


        const affectedRows =
            await removeSkillFromGig(
                gigId,
                skillId
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                message:
                    'Skill not found for this gig'
            });
        }


        res.status(200).json({

            message:
                'Skill removed from gig successfully'

        });

    } catch (error) {

        console.error(
            'Remove gig skill error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    addSkill,
    getSkills,
    removeSkill
};