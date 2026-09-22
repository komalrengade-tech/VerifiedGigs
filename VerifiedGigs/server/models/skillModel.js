const pool = require('../config/db');

// Get student_id from user_id
const getStudentIdByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT student_id
         FROM students
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};


// Get all available skills
const getAllSkills = async () => {
    const [rows] = await pool.query(
        `SELECT
            skill_id,
            skill_name,
            category,
            description
         FROM skills
         ORDER BY skill_name`
    );

    return rows;
};


// Create a new skill
const createSkill = async (
    skillName,
    category,
    description
) => {
    const [result] = await pool.query(
        `INSERT INTO skills
        (skill_name, category, description)
        VALUES (?, ?, ?)`,
        [
            skillName,
            category,
            description
        ]
    );

    return result.insertId;
};


// Add skill to student
const addStudentSkill = async (
    studentId,
    skillId,
    proficiencyLevel,
    yearsOfExperience
) => {

    const [result] = await pool.query(
        `INSERT INTO student_skills
        (student_id, skill_id, proficiency_level, years_of_experience)
        VALUES (?, ?, ?, ?)`,
        [
            studentId,
            skillId,
            proficiencyLevel,
            yearsOfExperience
        ]
    );

    return result.insertId;
};


// Get student's skills
const getStudentSkills = async (studentId) => {

    const [rows] = await pool.query(
        `SELECT
            ss.skill_id,
            s.skill_name,
            s.category,
            s.description,
            ss.proficiency_level,
            ss.years_of_experience
         FROM student_skills ss
         INNER JOIN skills s
             ON ss.skill_id = s.skill_id
         WHERE ss.student_id = ?
         ORDER BY s.skill_name`,
        [studentId]
    );

    return rows;
};


// Update student's skill
const updateStudentSkill = async (
    studentId,
    skillId,
    proficiencyLevel,
    yearsOfExperience
) => {

    const [result] = await pool.query(
        `UPDATE student_skills
         SET proficiency_level = ?,
             years_of_experience = ?
         WHERE student_id = ?
         AND skill_id = ?`,
        [
            proficiencyLevel,
            yearsOfExperience,
            studentId,
            skillId
        ]
    );

    return result.affectedRows;
};


// Delete student's skill
const deleteStudentSkill = async (
    studentId,
    skillId
) => {

    const [result] = await pool.query(
        `DELETE FROM student_skills
         WHERE student_id = ?
         AND skill_id = ?`,
        [
            studentId,
            skillId
        ]
    );

    return result.affectedRows;
};


module.exports = {
    getStudentIdByUserId,
    getAllSkills,
    createSkill,
    addStudentSkill,
    getStudentSkills,
    updateStudentSkill,
    deleteStudentSkill
};