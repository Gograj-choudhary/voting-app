const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure correct path to the model
const Room = require('../models/room');
const Candidate = require('../models/condidate'); // Ensure correct path to the model
const { jwtAuthMiddleware, generateAccessToken, generateRefreshToken } = require('./../jwt');

// POST route to add a user (Signup)
router.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body); // Create a new user
        const response = await newUser.save(); // Save to database

        console.log('Data saved successfully:', response);

        // Generate JWT token
        const payload = {
            id: response.id,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.status(201).json({ response, accessToken, refreshToken });
    } catch (err) {
        console.error('Error saving user:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body; // Extract aadharCardNumber and password

        // Validate inputs
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and Password are required.' });
        }

        // Find the user by aadharCardNumber
        const user = await User.findOne({ aadharCardNumber });

        // Validate user existence and password
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            role: user.role,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.json({ accessToken, refreshToken, role: user.role });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Room Login for voting
router.post('/room/login', jwtAuthMiddleware, async (req, res) => {
    const { roomId } = req.body; // Ensure roomId is destructured correctly from req.body

    try {
        // Find the room by roomId
        const room = await Room.findOne({ roomId }); // Use findOne with roomId

        if (!room) {
            return res.status(404).json({ message: "Room not found. Please check your Room ID." });
        }

        // Get the user data from the JWT middleware
        const user = req.user;
        const payload = {
            id: user.id,
            role: user.role,
            isVoted: user.isVoted,
            roomId, // Include roomId in the token
        }
        // Generate a new token with the roomId included
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload)

        // Send response with the updated token
        res.status(200).json({
            message: 'Logged into the room successfully.',
            accessToken, refreshToken
        });
    } catch (err) {
        console.error('Error logging into room:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Feching condidates from room
router.get('/room/candidates', jwtAuthMiddleware, async (req, res) => {
    try {
        const { roomId } = req.user; // Extract roomId from token
        const candidates = await Candidate.find({ roomId });
        
        if (!candidates || candidates.length === 0) {
            return res.status(404).json({ message: "No candidates found for this room." });
        }

        res.status(200).json({ candidates });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Router for voting a candidate
router.post("/room/vote", jwtAuthMiddleware, async (req, res) => {
    try {
        const { candidateId } = req.body;
        const { id: userId, roomId } = req.user;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user already voted
        const candidatesInRoom = await Candidate.find({ roomId });
        const hasVoted = candidatesInRoom.some(candidate =>
            candidate.votes.some(vote => vote.user.toString() === userId)
        );

        if (hasVoted) {
            return res.status(403).json({ message: "You have already voted in this room." });
        }

        // Cast vote logic here
        const candidate = await Candidate.findOne({ _id: candidateId, roomId });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found in this room." });
        }

        candidate.votes.push({ user: userId, votedAt: Date.now() });
        candidate.voteCount = candidate.votes.length;
        await candidate.save();

        res.status(200).json({ message: "Vote cast successfully!" });
    } catch (error) {
        console.error("Error while voting:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
});



// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User password update
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from token payload
        const { currentPassword, newPassword } = req.body;

        // Validate inputs
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required.' });
        }

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password.' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('Password updated successfully for user:', user.id);
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Error updating password:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Export the router
module.exports = router;
