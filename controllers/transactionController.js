const Transaction = require('../models/transaction');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const transaction = new Transaction(req.body);
        
        if(!req.body.company_id){
            transaction.company_id = req.user.company_id;
        }
        transaction.created_by = req.user._id;

        await transaction.save();

        // Send response
        (new ApiResponse(201, true, 'Transaction created successfully', transaction)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.get = async (req, res, next) => {
    const filter = {};
    const sort = {};
    
    if(req.query.transaction_code){
        filter.transaction_code = req.query.transaction_code;
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
        const transaction = await Transaction.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', transaction)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const transaction = await Transaction.findOne({_id: _id});
        if(!transaction){
            return next(ApiError.notFound('Transaction not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', transaction)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'company_id', 'updated_at', 'total', 'discount_value', 'total_payment'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        const transaction = await Transaction.findOne({_id: req.params.id});
        
        if(!transaction){
            return next(ApiError.notFound('Transaction not found'));
        } 

        updates.forEach((update) => transaction[update] = req.body[update]);
        transaction.updated_by = req.user._id;

        await transaction.save();

        (new ApiResponse(200, true, 'Transaction updated successfully', transaction)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const transaction = await Transaction.findOneAndDelete({_id});

        if(!transaction) {
            return next(ApiError.notFound('Transaction not found'));
        }

        (new ApiResponse(200, true, 'Transaction deleted successfully', transaction)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}