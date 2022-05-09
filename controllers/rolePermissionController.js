const RolePermission = require('../models/role_permission');
const Role = require('../models/role');
const Permission = require('../models/permission');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        
        const role_permission = new RolePermission(req.body);
        await role_permission.save();

        const permission = await Permission.findById(req.body.permission_id);

        // case untuk collection yang belum memiliki field permissions
        if(!role.permissions){
            role.permissions = [];
        }
        role.permissions.push(permission);

        await role.save();

        // Send response
        (new ApiResponse(201, true, 'Role Permission added successfully', role_permission)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const { id, permission_id } = req.params;

    try{
        await Role.findByIdAndUpdate(id, {$pull: {permissions: permission_id}});
        const role_permission = await RolePermission.findOneAndDelete({'role_id': id, 'permission_id': permission_id});

        if(!role_permission){
            return next(ApiError.notFound('Role Permission not found'));
        }

        (new ApiResponse(200, true, 'Role Permission deleted successfully', role_permission)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}