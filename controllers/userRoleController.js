const User = require('../models/user');
const UserRole = require('../models/user_role');
const Role = require('../models/role');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        const user_role = new UserRole(req.body);
        await user_role.save();

        const role = await Role.findById(req.body.role_id);

        // case untuk collection yang belum memiliki field permissions
        if(!user.roles){
            user.roles = [];
        }
        user.roles.push(role);

        await user.save();

        // Send response
        (new ApiResponse(201, true, 'User Role added successfully', user_role)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const { id, role_id } = req.params;

    try{
        await User.findByIdAndUpdate(id, {$pull: {roles: role_id}});
        const user_role = await UserRole.findOneAndDelete({'role_id': role_id, 'user_id': id});
        console.log('user_role: ', user_role);

        if(!user_role){
            return next(ApiError.notFound('User Role not found'));
        }

        (new ApiResponse(200, true, 'User Role deleted successfully', user_role)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}