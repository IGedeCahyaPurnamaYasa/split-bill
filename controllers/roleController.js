const Role = require('../models/role');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const role = new Role(req.body);
        role.created_by = req.user._id;

        await role.save();

        // Send response
        (new ApiResponse(201, true, 'Role created successfully', role)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.get = async (req, res, next) => {
    const filter = {};
    const sort = {};
    
    if(req.query.name){
        filter.name = req.query.name;
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    const options = {}

    if(req.query.limit){
        options.limit = parseInt(req.query.limit);
        options.skip = parseInt(req.query.skip);
    }

    try {
        const roles = await Role.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', roles)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const role = await Role.findOne({_id: _id});
        if(!role){
            return next(ApiError.notFound('Role not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', role)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        const role = await Role.findOne({_id: req.params.id});
        
        if(!role){
            return next(ApiError.notFound('Role not found'));
        } 

        updates.forEach((update) => role[update] = req.body[update]);
        role.updated_by = req.user._id;

        await role.save();

        (new ApiResponse(200, true, 'Role updated successfully', role)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const role = await Role.findOneAndDelete({_id});

        if(!role) {
            return next(ApiError.notFound('Role not found'));
        }

        (new ApiResponse(200, true, 'Role deleted successfully', role)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}