const pool = require('../config/db');

// Get student profile
const getStudentProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            u.user_id,
            u.name,
            u.email,
            u.phone,
            u.profile_picture,
            u.role,
            u.account_status,
            u.created_at,
            s.student_id,
            s.college_name,
            s.course,
            s.year_of_study,
            s.bio,
            s.location,
            s.hourly_rate,
            s.availability_status,
            s.verification_status
        FROM users u
        INNER JOIN students s
            ON u.user_id = s.user_id
        WHERE u.user_id = ?`,
        [userId]
    );

    return rows[0];
};


// Update student profile
const updateStudentProfile = async (
    userId,
    name,
    phone,
    profilePicture,
    collegeName,
    course,
    yearOfStudy,
    bio,
    location,
    hourlyRate,
    availabilityStatus
) => {

    await pool.query(
        `UPDATE users
         SET name = ?,
             phone = ?,
             profile_picture = ?
         WHERE user_id = ?`,
        [
            name,
            phone,
            profilePicture,
            userId
        ]
    );

    await pool.query(
        `UPDATE students
         SET college_name = ?,
             course = ?,
             year_of_study = ?,
             bio = ?,
             location = ?,
             hourly_rate = ?,
             availability_status = ?
         WHERE user_id = ?`,
        [
            collegeName,
            course,
            yearOfStudy,
            bio,
            location,
            hourlyRate,
            availabilityStatus,
            userId
        ]
    );
};


// Get client profile
const getClientProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            u.user_id,
            u.name,
            u.email,
            u.phone,
            u.profile_picture,
            u.role,
            u.account_status,
            u.created_at,
            c.client_id,
            c.company_name,
            c.company_description,
            c.company_website,
            c.location,
            c.client_type,
            c.verification_status
        FROM users u
        INNER JOIN clients c
            ON u.user_id = c.user_id
        WHERE u.user_id = ?`,
        [userId]
    );

    return rows[0];
};


// Update client profile
const updateClientProfile = async (
    userId,
    name,
    phone,
    profilePicture,
    companyName,
    companyDescription,
    companyWebsite,
    location,
    clientType
) => {

    await pool.query(
        `UPDATE users
         SET name = ?,
             phone = ?,
             profile_picture = ?
         WHERE user_id = ?`,
        [
            name,
            phone,
            profilePicture,
            userId
        ]
    );

    await pool.query(
        `UPDATE clients
         SET company_name = ?,
             company_description = ?,
             company_website = ?,
             location = ?,
             client_type = ?
         WHERE user_id = ?`,
        [
            companyName,
            companyDescription,
            companyWebsite,
            location,
            clientType,
            userId
        ]
    );
};


module.exports = {
    getStudentProfile,
    updateStudentProfile,
    getClientProfile,
    updateClientProfile
};