const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection LOCAL URL
//const mongoURL = process.env.MONGODB_URL_LOCAL;

// mongoDB Atlas URL
const mongoURL = process.env.MONGODB_URL;


// Connect to MongoDB when you  use locally
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Connect to MongoDB When you use render
//mongoose.connect(mongoURL);

// Get the default connection
const db = mongoose.connection;

// Event listeners for the database connection
db.on('connected', () => {
    console.log('Connected to MongoDB successfully');
});

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

db.on('disconnected', () => {
    console.warn('Disconnected from MongoDB');
});

//Export the mongoose instance for use in other files
module.exports = mongoose;
