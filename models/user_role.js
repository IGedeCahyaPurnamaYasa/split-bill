const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};

const userRoleSchema = new Schema({
    role_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    created_by : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updated_by : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, opts)

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
