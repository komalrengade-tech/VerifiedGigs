const managementModel = require('../models/managementModel');
const { getClientIdByUserId } = require('../models/projectModel');
const { getAllGigsAdmin, deleteGigAdmin } = require('../models/gigModel');

const clientDashboard = async (req, res) => {
    try {
        const clientId = await getClientIdByUserId(req.user.user_id);
        if (!clientId) return res.status(404).json({ message: 'Client profile not found' });
        res.status(200).json({ stats: await managementModel.getClientDashboardStats(clientId) });
    } catch (error) {
        console.error('Client dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const clientGigs = async (req, res) => {
    try {
        const clientId = await getClientIdByUserId(req.user.user_id);
        if (!clientId) return res.status(404).json({ message: 'Client profile not found' });
        res.status(200).json({ gigs: await managementModel.getClientGigs(clientId) });
    } catch (error) {
        console.error('Client gigs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const adminDashboard = async (req, res) => {
    try {
        res.status(200).json({ stats: await managementModel.getAdminDashboardStats() });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const adminUsers = async (req, res) => {
    try {
        res.status(200).json({ users: await managementModel.getAdminUsers(req.query.role) });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const adminUser = async (req, res) => {
    try {
        const user = await managementModel.getAdminUser(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user });
    } catch (error) {
        console.error('Admin user detail error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const changeUserStatus = async (req, res) => {
    try {
        const allowed = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
        if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid account status' });
        const affectedRows = await managementModel.updateUserStatus(req.params.userId, req.body.status);
        if (!affectedRows) return res.status(404).json({ message: 'User not found or cannot be modified' });
        res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Admin user status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const adminGigs = async (req, res) => {
    try { res.status(200).json({ gigs: await getAllGigsAdmin() }); }
    catch (error) { console.error('Admin gigs error:', error); res.status(500).json({ message: 'Server error' }); }
};

const adminDeleteGig = async (req, res) => {
    try {
        const result = await deleteGigAdmin(req.params.gigId);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Gig not found' });
        res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) { console.error('Admin delete gig error:', error); res.status(500).json({ message: 'Server error' }); }
};

const adminProjects = async (req, res) => {
    try { res.status(200).json({ projects: await managementModel.getAdminProjects() }); }
    catch (error) { console.error('Admin projects error:', error); res.status(500).json({ message: 'Server error' }); }
};

const adminPayments = async (req, res) => {
    try { res.status(200).json({ payments: await managementModel.getAdminPayments() }); }
    catch (error) { console.error('Admin payments error:', error); res.status(500).json({ message: 'Server error' }); }
};

const adminProfile = async (req, res) => {
    try {
        const profile = await managementModel.getAdminProfile(req.user.user_id);
        if (!profile) return res.status(404).json({ message: 'Admin profile not found' });
        res.status(200).json({ profile });
    } catch (error) { console.error('Admin profile error:', error); res.status(500).json({ message: 'Server error' }); }
};

const updateAdminProfile = async (req, res) => {
    try {
        const { name, phone, profilePicture } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
        const affectedRows = await managementModel.updateAdminProfile(req.user.user_id, name.trim(), phone || null, profilePicture || null);
        if (!affectedRows) return res.status(404).json({ message: 'Admin profile not found' });
        res.status(200).json({ message: 'Admin profile updated successfully' });
    } catch (error) { console.error('Update admin profile error:', error); res.status(500).json({ message: 'Server error' }); }
};

module.exports = {
    clientDashboard,
    clientGigs,
    adminDashboard,
    adminUsers,
    adminUser,
    changeUserStatus,
    adminGigs,
    adminDeleteGig,
    adminProjects,
    adminPayments,
    adminProfile,
    updateAdminProfile
};
