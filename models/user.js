const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
    },
    password: {
        required: true,
        type: String,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    // hash the password only user change the password or new user
    if(!user.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password,salt);
        
        // overright the palain password by hashedpassword
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }  
})
// inisilizing compare function when user update or change the password
userSchema.methods.comparePassword = async function (userPassword){
    try{
        // use bcrypt to compare the provided password with hashed password
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}



// Export user model
const User = mongoose.model('User', userSchema);  
module.exports = User;
