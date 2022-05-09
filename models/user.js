const mongoose = require('mongoose');
const Company = require('../models/company');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const opts = {
    toJSON: {virtuals: true},
    timestamps: true
};

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Emails is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        }
    ],
    country: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    postal_code: {
        type: String
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        // required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, opts)

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    if(user.isModified('company_id')){
        const company = await Company.findById(user.company_id);
        if(!company){
            throw new Error('Company not found');
        }

        user.company_id = company;
    }

    next();
})

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    
    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;