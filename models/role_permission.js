const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    }
})

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);

module.exports = RolePermission;
