const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes =
    require('./routes/notificationRoutes');
const categoryRoutes =
    require('./routes/categoryRoutes');
const gigSkillRoutes =
    require('./routes/gigSkillRoutes');
const favoriteGigRoutes =
    require('./routes/favoriteGigRoutes');
const reportRoutes =
    require('./routes/reportRoutes');
const verificationDocumentRoutes =
    require('./routes/verificationDocumentRoutes');
const studentDashboardRoutes =
    require('./routes/studentDashboardRoutes');
const gigRoutes =
    require('./routes/gigRoutes');
const applicationRoutes =
    require('./routes/applicationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const managementRoutes = require('./routes/managementRoutes');
 

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', skillRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', milestoneRoutes);
app.use('/api', paymentRoutes);
app.use('/api', reviewRoutes);
app.use('/api', messageRoutes);
app.use('/api', notificationRoutes);
app.use('/api', categoryRoutes);
app.use('/api', gigSkillRoutes);
app.use('/api', favoriteGigRoutes);
app.use('/api', reportRoutes);
app.use(
    '/api',
    verificationDocumentRoutes
);
app.use('/api', studentDashboardRoutes);
app.use('/api', gigRoutes);
app.use('/api', applicationRoutes);
app.use('/api', projectRoutes);
app.use('/api', managementRoutes);
 

const PORT = process.env.PORT || 5000;

const {
    authenticateToken,
    authorizeRoles
} = require('./middleware/authMiddleware');

// Test API
app.get('/api/test', (req, res) => {
    res.json({
        message: 'VerifiedGigs API is working'
    });
});

// Test MySQL connection
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS result');

        res.json({
            message: 'MySQL connection successful',
            data: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'MySQL connection failed',
            error: error.message
        });
    }
});

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'You accessed a protected route',
        user: req.user
    });
});

app.get(
    '/api/student-only',
    authenticateToken,
    authorizeRoles('STUDENT'),
    (req, res) => {
        res.json({
            message: 'Welcome Student!',
            user: req.user
        });
    }
);

app.get(
    '/api/client-only',
    authenticateToken,
    authorizeRoles('CLIENT'),
    (req, res) => {
        res.json({
            message: 'Welcome Client!',
            user: req.user
        });
    }
);

app.get(
    '/api/admin-only',
    authenticateToken,
    authorizeRoles('ADMIN'),
    (req, res) => {
        res.json({
            message: 'Welcome Admin!',
            user: req.user
        });
    }
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});