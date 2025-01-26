const express = require('express');
const router = express.Router();
const Candidate = require('../models/condidate'); // Ensure correct path to the model
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const User = require('../models/user'); // Ensure correct path to the User model
const Room = require('../models/room');
const { json } = require('body-parser');

// checking that user is admin or not
const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user && user.role === 'admin';
    } catch (err) {
        console.error('Error checking admin role:', err);
        return false;
    }
}


// Creating a room for voting
router.post('/room', jwtAuthMiddleware, async (req, res) => {
    const { roomName, roomId } = req.body;

    if (!roomName || !roomId) {
        return res.status(400).json({ error: 'Room Name and Room ID are required.' });
    }

    try {
        const adminId = req.user.id; // Admin ID from the JWT

        // Save room to the database
        const newRoom = new Room({
            roomId,
            name: roomName,
            adminId,
            createdAt: new Date(),
        });

        const savedRoom = await newRoom.save();

        // Generate a new token with roomId included
        const token = generateToken({ id: adminId, role: req.user.role, roomId });

        res.status(201).json({
            message: 'Room created successfully.',
            room: savedRoom,
            token, // Return the updated token to the client
        });
    } catch (err) {
        console.error('Error creating room:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to log in to a room
router.post('/room/login', jwtAuthMiddleware, async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required to log in.' });
    }

    try {
        // Validate if the room exists
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        const user = req.user; // User data from JWT middleware

        // Generate a new token with roomId included
        const token = generateToken({ id: user.id, role: user.role, roomId });

        res.status(200).json({
            message: 'Logged into room successfully.',
            token,
        });
    } catch (err) {
        console.error('Error logging into room:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Adding candidates to the room
router.post('/room/candidate', jwtAuthMiddleware, async (req, res) => {
    const candidates = req.body;

    if (!Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({ error: 'Candidates array is required and cannot be empty.' });
    }

    try {
        const adminId = req.user.id; // Extract adminId from the token
        const roomId = req.user.roomId; // Extract roomId from the token/session

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID not found in user session.' });
        }

        // Save each candidate to the database
        const savedCandidates = await Promise.all(
            candidates.map(async (candidate) => {
                const { name, party, age, aadharCardNumber } = candidate;

                if (!name || !party || !age || !aadharCardNumber) {
                    throw new Error('Each candidate must have name, party, age, and aadharCardNumber.');
                }

                const newCandidate = new Candidate({
                    name,
                    party,
                    age,
                    aadharCardNumber,
                    adminId, // Associate the admin with the candidates
                    roomId, // Automatically associate with the logged-in room
                });

                return await newCandidate.save();
            })
        );

        console.log('Candidates Created Successfully:', savedCandidates);
        res.status(201).json({
            message: 'Candidates added successfully.',
            candidates: savedCandidates,
        });
    } catch (err) {
        console.error('Error saving candidates:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete a candidate
router.delete('/room/delete', jwtAuthMiddleware, async (req, res) => {
    const { aadharCardNumber } = req.body;

    // Validate input
    if (!aadharCardNumber) {
        return res.status(400).json({ error: 'Candidate aadharCardNumber is required.' });
    }

    try {
        const adminId = req.user.id; // Extract admin ID from token
        const roomId = req.user.roomId; // Extract room ID from token/session

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID not found in user session.' });
        }

        // Find and delete the candidate in the database
        const deletedCandidate = await Candidate.findOneAndDelete({
            adminId: adminId,
            roomId: roomId,
            aadharCardNumber: aadharCardNumber,
        });

        if (!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }

        console.log('Candidate deleted successfully:', deletedCandidate);
        res.status(200).json({
            message: 'Candidate deleted successfully.',
            candidate: deletedCandidate,
        });
    } catch (error) {
        console.error('Error deleting candidate:', error.message);
        res.status(500).json({ error: error.message || 'Internal server error.' });
    }
});



// Fetch candidate details by Aadhar Card Number

router.get('/room/candidate/:aadharCardNumber', jwtAuthMiddleware, async (req, res) => {
    const { aadharCardNumber } = req.params;
    const roomId = req.user.roomId; // Extract roomId from the token

    if (!aadharCardNumber) {
        return res.status(400).json({ error: 'Aadhar Card Number is required.' });
    }

    try {
        // Find the candidate in the specified room
        const candidate = await Candidate.findOne({ aadharCardNumber, roomId });

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }

        res.status(200).json(candidate);
    } catch (error) {
        console.error('Error fetching candidate:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Update candidate details by Aadhar Card Number

router.put('/room/candidate', jwtAuthMiddleware, async (req, res) => {
    const { aadharCardNumber, name, age, party } = req.body;
    const roomId = req.user.roomId; // Extract roomId from the token

    if (!aadharCardNumber || !name || !age || !party) {
        return res.status(400).json({ error: 'Aadhar Card Number, Name, Age, and Party are required.' });
    }

    try {
        // Find and update the candidate in the specified room
        const candidate = await Candidate.findOneAndUpdate(
            { aadharCardNumber, roomId },
            { name, age, party },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found or does not belong to your room.' });
        }

        res.status(200).json({
            message: 'Candidate details updated successfully.',
            candidate,
        });
    } catch (error) {
        console.error('Error updating candidate:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Lets start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) =>{
    // no admin can vote
    // user can vote once

    candidateID = req.params.candidateID;
    userID = req.user.id;

    try{
        // Find the condidate document with the specified condidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            res.status(404).json({message:'Candidate not found'});
        }
        if(!user){
            res.status(404).json({message:'User not found'});
        }
        if(!user.isVoted){
            res.status(400).json({message:'User already voted'});
        }
        if(user.role=='admin'){
            res.status(403).json({message:'User should not Admin'});
        }

        //update the condidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        //update the user document
        user.isVoted = true
        await user.save();

        res.status(200).json({message:'Vote recorded successfully'});
    }catch(err){
        console.error('Error voting candidate:', err);
        res.status(500).json({ error: 'Internal server error' });

    }
})

// vote count
router.get('/room/votes', jwtAuthMiddleware, async (req, res) => {
    const roomId = req.user.roomId; // Extract roomId from the token

    try {
        const candidates = await Candidate.find({ roomId })
            .sort({ voteCount: -1 }) // Sort candidates by votes in descending order
            .select('name party voteCount'); // Fetch only required fields

        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error fetching vote counts:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Voting result releasing 
router.post('/room/release-results', jwtAuthMiddleware, async (req, res) => {
    const roomId = req.user.roomId; // Extract roomId from the token

    try {
        // Find the room and set voting as completed
        const room = await Room.findByIdAndUpdate(
            roomId,
            { votingReleased: true },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        res.status(200).json({ message: 'Voting results released successfully.', room });
    } catch (error) {
        console.error('Error releasing voting results:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Export the router
module.exports = router;
