const pool = require('../config/db');

const getClientDashboardStats = async (clientId) => {
    const [[stats]] = await Promise.all([
        pool.query(`SELECT
            (SELECT COUNT(*) FROM gigs WHERE client_id = ?) AS totalGigs,
            (SELECT COUNT(*) FROM gigs WHERE client_id = ? AND status = 'OPEN') AS openGigs,
            (SELECT COUNT(*) FROM applications a INNER JOIN gigs g ON a.gig_id = g.gig_id WHERE g.client_id = ?) AS applications,
            (SELECT COUNT(*) FROM projects WHERE client_id = ? AND project_status IN ('NOT_STARTED', 'IN_PROGRESS')) AS activeProjects,
            (SELECT COUNT(*) FROM projects WHERE client_id = ? AND project_status = 'COMPLETED') AS completedProjects`,
            [clientId, clientId, clientId, clientId, clientId])
    ]);
    return Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, Number(value)]));
};

const getClientGigs = async (clientId) => {
    const [rows] = await pool.query(`SELECT
        g.gig_id, g.client_id, g.category_id, g.title, g.description,
        g.budget_min, g.budget_max, g.deadline, g.required_experience,
        g.status, g.created_at, g.updated_at, gc.category_name
        FROM gigs g
        INNER JOIN gig_categories gc ON g.category_id = gc.category_id
        WHERE g.client_id = ?
        ORDER BY g.created_at DESC`, [clientId]);
    return rows;
};

const getAdminDashboardStats = async () => {
    const [rows] = await pool.query(`SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') AS totalStudents,
        (SELECT COUNT(*) FROM users WHERE role = 'CLIENT') AS totalClients,
        (SELECT COUNT(*) FROM gigs WHERE status = 'OPEN') AS openGigs,
        (SELECT COUNT(*) FROM projects WHERE project_status IN ('NOT_STARTED', 'IN_PROGRESS')) AS activeProjects,
        (SELECT COUNT(*) FROM verification_documents WHERE verification_status = 'PENDING') AS pendingVerifications,
        (SELECT COUNT(*) FROM reports WHERE report_status IN ('PENDING', 'UNDER_REVIEW')) AS openReports`);
    return Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [key, Number(value)]));
};

const getAdminUsers = async (role) => {
    const params = [];
    let roleFilter = '';
    if (role) {
        roleFilter = 'WHERE u.role = ?';
        params.push(role);
    }
    const [rows] = await pool.query(`SELECT
        u.user_id, u.name, u.email, u.phone, u.profile_picture,
        u.role, u.account_status, u.created_at, u.last_login,
        s.student_id, s.college_name, s.course, s.verification_status AS student_verification_status,
        c.client_id, c.company_name, c.verification_status AS client_verification_status
        FROM users u
        LEFT JOIN students s ON s.user_id = u.user_id
        LEFT JOIN clients c ON c.user_id = u.user_id
        ${roleFilter}
        ORDER BY u.created_at DESC`, params);
    return rows;
};

const getAdminUser = async (userId) => {
    const users = await getAdminUsers();
    return users.find((user) => Number(user.user_id) === Number(userId)) || null;
};

const updateUserStatus = async (userId, status) => {
    const [result] = await pool.query(
        `UPDATE users SET account_status = ? WHERE user_id = ? AND role <> 'ADMIN'`,
        [status, userId]
    );
    return result.affectedRows;
};

const getAdminProjects = async () => {
    const [rows] = await pool.query(`SELECT
        p.project_id, p.project_title, p.project_status, p.agreed_amount,
        p.start_date, p.expected_end_date, p.actual_end_date, p.created_at,
        c.company_name, cu.name AS client_name, cu.email AS client_email,
        su.name AS student_name, su.email AS student_email
        FROM projects p
        INNER JOIN clients c ON p.client_id = c.client_id
        INNER JOIN users cu ON c.user_id = cu.user_id
        INNER JOIN students s ON p.student_id = s.student_id
        INNER JOIN users su ON s.user_id = su.user_id
        ORDER BY p.created_at DESC`);
    return rows;
};

const getAdminPayments = async () => {
    const [rows] = await pool.query(`SELECT
        pay.payment_id, pay.project_id, pay.milestone_id, pay.amount,
        pay.payment_method, pay.transaction_id, pay.payment_status, pay.payment_date,
        p.project_title, cu.name AS client_name, su.name AS student_name
        FROM payment pay
        INNER JOIN projects p ON pay.project_id = p.project_id
        INNER JOIN clients c ON p.client_id = c.client_id
        INNER JOIN users cu ON c.user_id = cu.user_id
        INNER JOIN students s ON p.student_id = s.student_id
        INNER JOIN users su ON s.user_id = su.user_id
        ORDER BY pay.payment_date DESC`);
    return rows;
};

const getAdminProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT user_id, name, email, phone, profile_picture, role, account_status, created_at, last_login
         FROM users WHERE user_id = ? AND role = 'ADMIN'`,
        [userId]
    );
    return rows[0] || null;
};

const updateAdminProfile = async (userId, name, phone, profilePicture) => {
    const [result] = await pool.query(
        `UPDATE users SET name = ?, phone = ?, profile_picture = ? WHERE user_id = ? AND role = 'ADMIN'`,
        [name, phone, profilePicture, userId]
    );
    return result.affectedRows;
};

module.exports = {
    getClientDashboardStats,
    getClientGigs,
    getAdminDashboardStats,
    getAdminUsers,
    getAdminUser,
    updateUserStatus,
    getAdminProjects,
    getAdminPayments,
    getAdminProfile,
    updateAdminProfile
};
