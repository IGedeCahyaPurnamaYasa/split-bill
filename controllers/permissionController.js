const Permission = require('../models/permission');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();

        // Send response
        (new ApiResponse(201, true, 'Permission created successfully', permission)).send(res);
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
        const permissions = await Permission.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', permissions)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const permission = await Permission.findOne({_id: _id});
        if(!permission){
            return next(ApiError.notFound('Permission not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', permission)).send(res);
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
        const permission = await Permission.findOne({_id: req.params.id});
        
        if(!permission){
            return next(ApiError.notFound('Permission not found'));
        } 

        updates.forEach((update) => permission[update] = req.body[update]);
        
        await permission.save();

        (new ApiResponse(200, true, 'Permission updated successfully', permission)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const permission = await Permission.findOneAndDelete({_id});

        if(!permission) {
            return next(ApiError.notFound('Permission not found'));
        }

        (new ApiResponse(200, true, 'Permission deleted successfully', permission)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}