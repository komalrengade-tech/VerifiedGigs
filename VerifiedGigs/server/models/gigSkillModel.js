const pool = require('../config/db');


// ========================================
// ADD SKILL TO GIG
// ========================================

const addSkillToGig = async (
    gigId,
    skillId,
    importanceLevel
) => {

    const [result] = await pool.query(
        `INSERT INTO gig_skills
        (
            gig_id,
            skill_id,
            importance_level
        )
        VALUES (?, ?, ?)`,
        [
            gigId,
            skillId,
            importanceLevel || null
        ]
    );

    return result;
};


// ========================================
// GET SKILLS FOR GIG
// ========================================

const getGigSkills = async (gigId) => {

    const [rows] = await pool.query(
        `SELECT
            gs.gig_id,
            gs.skill_id,
            s.skill_name,
            s.category,
            gs.importance_level
         FROM gig_skills gs

         INNER JOIN skills s
             ON gs.skill_id = s.skill_id

         WHERE gs.gig_id = ?`,
        [gigId]
    );

    return rows;
};


// ========================================
// REMOVE SKILL FROM GIG
// ========================================

const removeSkillFromGig = async (
    gigId,
    skillId
) => {

    const [result] = await pool.query(
        `DELETE FROM gig_skills
         WHERE gig_id = ?
         AND skill_id = ?`,
        [
            gigId,
            skillId
        ]
    );

    return result.affectedRows;
};


module.exports = {
    addSkillToGig,
    getGigSkills,
    removeSkillFromGig
};