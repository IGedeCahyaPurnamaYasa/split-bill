
const Permission = require('../models/permission')
const ApiError = require('../utils/error/ApiError');


const permission = (can) => {
    return (req, res, next) => {
        try{
            if(!req.permissions.includes(can))
                throw new Error("You dont have permission to access this page!");
            next();
        } catch (e) {
            next(ApiError.unAuthorized(e.message, e.errors));
        }
    }
}


module.exports = permission;