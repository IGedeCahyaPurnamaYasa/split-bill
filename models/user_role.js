const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    }
})

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
