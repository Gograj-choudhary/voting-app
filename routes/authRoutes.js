const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('./../jwt'); // Import your token verification function

// POST route to verify an access token
router.post('/verify-token', async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or malformed.' });
        }

        const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // Verify the token using the custom verifyAccessToken function
        const decoded = verifyAccessToken(token); // This function should throw an error if verification fails

        // If token is verified, return success response
        res.status(200).json({ success: true, message: 'Token is valid.', user: decoded });
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
});

module.exports = router;
