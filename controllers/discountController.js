const Discount = require('../models/discount');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const discount = new Discount(req.body);

        if(!req.body.company_id){
            discount.company_id = req.user.company_id;
        }
        
        await discount.save();

        // Send response
        (new ApiResponse(201, true, 'Discount created successfully', discount)).send(res);
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
        const discounts = await Discount.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', discounts)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const discount = await Discount.findOne({_id: _id});
        if(!discount){
            return next(ApiError.notFound('Discount not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', discount)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'menu_item_id',
        'name',
        'description',
        'discount_rate',
        'discount_value',
        'discount_type',
        'start_date_time',
        'expired_date_time',
    ];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        const discount = await Discount.findOne({_id: req.params.id});
        
        if(!discount){
            return next(ApiError.notFound('Discount not found'));
        } 

        updates.forEach((update) => discount[update] = req.body[update]);
        
        await discount.save();

        (new ApiResponse(200, true, 'Discount updated successfully', discount)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const discount = await Discount.findOneAndDelete({_id});

        if(!discount) {
            return next(ApiError.notFound('Discount not found'));
        }

        (new ApiResponse(200, true, 'Discount deleted successfully', discount)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}