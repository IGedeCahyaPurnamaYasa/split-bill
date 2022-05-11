const MenuType = require('../models/menu_type');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const menu_type = new MenuType(req.body);
        menu_type.created_by = req.user._id;

        await menu_type.save();

        // Send response
        (new ApiResponse(201, true, 'Menu Type created successfully', menu_type)).send(res);
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
        const menu_types = await MenuType.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', menu_types)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const menu_type = await MenuType.findOne({_id: _id});
        if(!menu_type){
            return next(ApiError.notFound('Menu Type not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', menu_type)).send(res);
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
        const menu_type = await MenuType.findOne({_id: req.params.id});
        
        if(!menu_type){
            return next(ApiError.notFound('Menu Type not found'));
        } 

        updates.forEach((update) => menu_type[update] = req.body[update]);
        menu_type.updated_by = req.user._id;

        await menu_type.save();

        (new ApiResponse(200, true, 'Menu Type updated successfully', menu_type)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const menu_type = await MenuType.findOneAndDelete({_id});

        if(!menu_type) {
            return next(ApiError.notFound('Menu Type not found'));
        }

        (new ApiResponse(200, true, 'Menu Type deleted successfully', menu_type)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}