const Transaction = require('../models/transaction');
const Splitbill = require('../models/splitbill');
const ApiError = require('../utils/error/ApiError');
const validateErrorHandler = require('../utils/validateErrorHandler');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        
        const splitbill = new Splitbill(req.body);
        validateErrorHandler(splitbill);
        splitbill.created_by = req.user._id;

        await splitbill.save();

        // Send response
        (new ApiResponse(201, true, 'Splitbill created successfully', splitbill)).send(res);
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

    if(req.query.transaction_code){
        filter.transaction_code = req.query.transaction_code;
    }

    if(req.query.transaction_id){
        filter.transaction_id = req.query.transaction_id;
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
        const splitbill = await Splitbill.find(filter, options)
                    .populate('transaction_id')    
                    .sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', splitbill)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id;

    try {
        const splitbill = await Splitbill.findOne({_id: _id});
        if(!splitbill){
            return next(ApiError.notFound('Splitbill not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', splitbill)).send(res);
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
        const splitbill = await Splitbill.findOne({_id: req.params.id});
        
        if(!splitbill){
            return next(ApiError.notFound('Splitbill not found'));
        } 

        updates.forEach((update) => splitbill[update] = req.body[update]);
        splitbill.updated_by = req.user._id;

        await splitbill.save();

        (new ApiResponse(200, true, 'Splitbill updated successfully', splitbill)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const splitbill = await Splitbill.findOneAndDelete({_id});

        if(!splitbill) {
            return next(ApiError.notFound('Splitbill not found'));
        }

        (new ApiResponse(200, true, 'Splitbill deleted successfully', splitbill)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}