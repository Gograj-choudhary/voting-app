const mongoose = require('mongoose');

const condidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    party:{
        required: true,
        type: String
    },
    age:{
        type: Number,
        required: true
    },
    aadharCardNumber: {
        type: String,  
        required: true,
    },
    adminId:{
        type:String,
        required:true
    },
    roomId:{
        type: String,
        required: true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now()
            }
        }
    ],

    voteCount: {
        type: Number,
        default: 0
    }


});

// Exporting condidate
const Condidate = mongoose.model('Condidate', condidateSchema);
module.exports = Condidate;