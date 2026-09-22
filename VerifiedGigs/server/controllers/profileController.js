const {
    getStudentProfile,
    updateStudentProfile,
    getClientProfile,
    updateClientProfile
} = require('../models/profileModel');


// ================================
// GET STUDENT PROFILE
// ================================

const studentProfile = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const profile = await getStudentProfile(userId);

        if (!profile) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        res.status(200).json({
            profile
        });

    } catch (error) {

        console.error('Student profile error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ================================
// UPDATE STUDENT PROFILE
// ================================

const updateStudent = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const {
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
        } = req.body;

        await updateStudentProfile(
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
        );

        res.status(200).json({
            message: 'Student profile updated successfully'
        });

    } catch (error) {

        console.error('Update student error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ================================
// GET CLIENT PROFILE
// ================================

const clientProfile = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const profile = await getClientProfile(userId);

        if (!profile) {
            return res.status(404).json({
                message: 'Client profile not found'
            });
        }

        res.status(200).json({
            profile
        });

    } catch (error) {

        console.error('Client profile error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


// ================================
// UPDATE CLIENT PROFILE
// ================================

const updateClient = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const {
            name,
            phone,
            profilePicture,
            companyName,
            companyDescription,
            companyWebsite,
            location,
            clientType
        } = req.body;

        await updateClientProfile(
            userId,
            name,
            phone,
            profilePicture,
            companyName,
            companyDescription,
            companyWebsite,
            location,
            clientType
        );

        res.status(200).json({
            message: 'Client profile updated successfully'
        });

    } catch (error) {

        console.error('Update client error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    studentProfile,
    updateStudent,
    clientProfile,
    updateClient
};