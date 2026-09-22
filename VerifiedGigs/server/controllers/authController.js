const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    findUserByEmail,
    createUser,
    createStudent,
    createClient
} = require('../models/userModel');

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: 'Name, email, password and role are required'
            });
        }

        // Validate role
        const allowedRoles = ['STUDENT', 'CLIENT'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: 'Invalid role'
            });
        }

        // Check whether email already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const userId = await createUser(
            name,
            email,
            passwordHash,
            phone || null,
            null,
            role
        );

        // Create role-specific profile
        if (role === 'STUDENT') {
            const {
                collegeName,
                course,
                yearOfStudy,
                bio,
                location,
                hourlyRate
            } = req.body;

            await createStudent(
                userId,
                collegeName || null,
                course || null,
                yearOfStudy || null,
                bio || null,
                location || null,
                hourlyRate || null
            );
        }

        if (role === 'CLIENT') {
            const {
                companyName,
                companyDescription,
                companyWebsite,
                location,
                clientType
            } = req.body;

            await createClient(
                userId,
                companyName || null,
                companyDescription || null,
                companyWebsite || null,
                location || null,
                clientType || null
            );
        }

        res.status(201).json({
            message: 'Registration successful',
            userId
        });

    } catch (error) {
        console.error('Registration error:', error);

        res.status(500).json({
            message: 'Server error during registration'
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // 2. Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // 3. Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // 4. Create JWT
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        // 5. Update last login
        const pool = require('../config/db');

        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE user_id = ?',
            [user.user_id]
        );

        // 6. Send response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            message: 'Server error during login'
        });
    }
};
module.exports = {
    register,
     login
};