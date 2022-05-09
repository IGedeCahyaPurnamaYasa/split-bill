const MenuItem = require('../models/menu_item');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const menu_item = new MenuItem(req.body);
        await menu_item.save();
        
        if(!req.body.company_id){
            menu_item.company_id = req.user.company_id;
        }

        // Send response
        (new ApiResponse(201, true, 'Menu Item created successfully', menu_item)).send(res);
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
        const menu_items = await MenuItem.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', menu_items)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const menu_item = await MenuItem.findOne({_id: _id});
        if(!menu_item){
            return next(ApiError.notFound('Menu Item not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', menu_item)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'type_id', 'company_id'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        const menu_item = await MenuItem.findOne({_id: req.params.id});
        
        if(!menu_item){
            return next(ApiError.notFound('Menu Item not found'));
        } 

        updates.forEach((update) => menu_item[update] = req.body[update]);
        
        await menu_item.save();

        (new ApiResponse(200, true, 'Menu Item updated successfully', menu_item)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const menu_item = await MenuItem.findOneAndDelete({_id});

        if(!menu_item) {
            return next(ApiError.notFound('Menu Item not found'));
        }

        (new ApiResponse(200, true, 'Menu Item deleted successfully', menu_item)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}