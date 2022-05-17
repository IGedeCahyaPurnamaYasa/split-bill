const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const RolePermission = require('../models/role_permission')
const Role = require('../models/role');
const Permission = require('../models/permission');
const ApiError = require('../utils/error/ApiError');

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error("Error occured");
        }

        req.token = token
        req.user = user

        const permissions = await get_permissions(user);
        req.permissions = permissions;

        next();
    } catch (e) {
        next(ApiError.unAuthorized(e.message, e.errors));
    }
}

const get_permissions = async (user) => {
    const user_permission = await Role.find({_id: {
        $in : user.roles
    }}, {
        permissions: 1, _id: 0
    });

    let arr_permissions = [];
    user_permission.map(perm => {
        arr_permissions = arr_permissions.concat(perm.permissions);
    })
    
    const permissions = await Permission.find({_id: {
        $in : arr_permissions
    }}, {
        slug: 1, _id: 0
    });

    return permissions.map(({slug}) => slug);
}

module.exports = auth;