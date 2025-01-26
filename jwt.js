const jwt = require('jsonwebtoken');

// Middleware for verifying JWT token
const jwtAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or malformed.' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Function to generate a new access token
const generateAccessToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15m' }); // Access tokens are short-lived (15 minutes)
};

// Function to generate a refresh token
const generateRefreshToken = (userData) => {
    return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Refresh tokens are long-lived (7 days)
};

// Refresh token endpoint logic
const refreshTokenHandler = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'Refresh token is missing.' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        // Generate a new access token
        const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(403).json({ error: 'Invalid or expired refresh token.' });
    }
};

// Function to verify a token (Reusable)
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.emitnv.JWT_SECRET); // Decode and verify the token
    } catch (err) {
        console.error('Token verification error:', err);
        return null; // Return null if token is invalid or expired
    }
};

module.exports = {
    jwtAuthMiddleware,
    generateAccessToken,
    generateRefreshToken,
    refreshTokenHandler,
    verifyAccessToken
};
