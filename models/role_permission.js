const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};

const rolePermissionSchema = new Schema({
    role_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },
    permission_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Permission'
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

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);

module.exports = RolePermission;
