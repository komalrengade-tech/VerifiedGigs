const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    return rows[0];
};

const createUser = async (
    name,
    email,
    passwordHash,
    phone,
    profilePicture,
    role
) => {
    const [result] = await pool.query(
        `INSERT INTO users
        (name, email, password_hash, phone, profile_picture, role)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            name,
            email,
            passwordHash,
            phone,
            profilePicture,
            role
        ]
    );

    return result.insertId;
};

const createStudent = async (
    userId,
    collegeName,
    course,
    yearOfStudy,
    bio,
    location,
    hourlyRate
) => {
    const [result] = await pool.query(
        `INSERT INTO students
        (user_id, college_name, course, year_of_study,
         bio, location, hourly_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            collegeName,
            course,
            yearOfStudy,
            bio,
            location,
            hourlyRate
        ]
    );

    return result.insertId;
};

const createClient = async (
    userId,
    companyName,
    companyDescription,
    companyWebsite,
    location,
    clientType
) => {
    const [result] = await pool.query(
        `INSERT INTO clients
        (user_id, company_name, company_description,
         company_website, location, client_type)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            userId,
            companyName,
            companyDescription,
            companyWebsite,
            location,
            clientType
        ]
    );

    return result.insertId;
};

const getUserIdByStudentId = async (studentId) => {
    const [rows] = await pool.query(
        'SELECT user_id FROM students WHERE student_id = ?',
        [studentId]
    );
    return rows[0]?.user_id || null;
};

const getUserIdByClientId = async (clientId) => {
    const [rows] = await pool.query(
        'SELECT user_id FROM clients WHERE client_id = ?',
        [clientId]
    );
    return rows[0]?.user_id || null;
};

module.exports = {
    findUserByEmail,
    createUser,
    createStudent,
    createClient,
    getUserIdByStudentId,
    getUserIdByClientId
};