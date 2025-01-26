const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db'); 
const cors = require('cors');

const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Allow localhost:5000 origin
app.use(cors({
    origin: 'http://localhost:5000',
}));


// Extracting port information
const PORT = process.env.PORT || 3000;

//const {jwtAuthMiddleware} = require('./jwt');


// Import the router file
const userRoutes = require('./routes/userRoutes');
const condidateRoutes = require('./routes/condidateRoutes');
const authRoutes = require('./routes/authRoutes')

// use the routes
app.use('/user', userRoutes);
app.use('/condidate', condidateRoutes);
app.use('/auth', authRoutes);



// Start server after MongoDB connects
app.listen(3000 , () => {
    console.log(`Server is running on port 3000`);
});

