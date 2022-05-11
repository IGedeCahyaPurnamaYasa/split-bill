const TransactionItem = require('../models/transaction_item');
const Splitbill = require('../models/splitbill');
const SplitbillItem = require('../models/splitbill_item');
const Discount = require('../models/discount');
const ApiError = require('../utils/error/ApiError');
const validateErrorHandler = require('../utils/validateErrorHandler');
const CustomError = require('../utils/error/CustomError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        // id splitbill
        const {id} = req.params;

        let splitbill_item = new SplitbillItem(req.body);
        
        splitbill_item.splitbill_id = id;
        
        validateErrorHandler(splitbill_item);
        const check_qty = await check_qty_transaction_item(splitbill_item, 'create');

        if(check_qty){
            throw new CustomError('Quantity exceed transaction item', null);
        }

        splitbill_item.created_by = req.user._id;

        await splitbill_item.save();
        await calculate_splitbill_item(splitbill_item);
        
        // Send response
        (new ApiResponse(201, true, 'Splitbill Item created successfully', splitbill_item)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

const check_qty_transaction_item = async (item, action) => {
    const not_in = [];
    
    if(action === 'update'){
        not_in.push(item._id);
    }
    
    const transaction_item = await TransactionItem.findOne({_id: item.transaction_item_id});
    const splitbill_item = await SplitbillItem.aggregate([
        {
            $match: {
                transaction_item_id : item.transaction_item_id,
                _id: { $nin : not_in}
            }
        },
        {
            $group: {
                _id: null,
                total_qty: {$sum: "$qty"},
            }
        }
    ])
    
    let qty = splitbill_item[0].total_qty ?? 0;
    return ((qty + item.qty) > transaction_item.qty);
}

const calculate_splitbill_item = async (item) => {
    const transaction_item = await TransactionItem.findOne({_id: item.transaction_item_id});

    item.total = transaction_item.price * item.qty;
    item.discount_value = transaction_item.discount_per_piece * item.qty;
    item.after_discount_value = item.total - item.discount_value;
    
    item.save();
}

module.exports.get = async (req, res, next) => {
    
    const {id} = req.params

    const filter = {};
    const sort = {};
    
    // set splitbill id filter by the splitbill_id param
    filter.splitbill_id = id;
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    const options = {}

    if(req.query.limit){
        options.limit = parseInt(req.query.limit);
        options.skip = parseInt(req.query.skip);
    }

    const include = '';

    try {
        const splitbill_item = await SplitbillItem.find(filter, include, options)
                    .populate({
                        path: 'transaction_item_id',
                        select: ['price', 'menu_item_id'],
                        populate: {
                            path: 'menu_item_id',
                            select: ['name']
                        }                         
                    })
                    .sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', splitbill_item)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const { id, id_item } = req.params

    try {
        const splitbill_item = await SplitbillItem.findOne({splitbill_id: id, _id: id_item})
                    .populate({
                        path: 'transaction_item_id',
                        select: ['price', 'menu_item_id'],
                        populate: {
                            path: 'menu_item_id',
                            select: ['name']
                        }                         
                    });

        if(!splitbill_item){
            return next(ApiError.notFound('Splitbill Item not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', splitbill_item)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {

    const { id, id_item } = req.params;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['qty', 'updated_at'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        let splitbill_item = await SplitbillItem.findOne({splitbill_id: id,_id: id_item});
        
        if(!splitbill_item){
            return next(ApiError.notFound('Splitbill Item not found'));
        }
        
        updates.forEach((update) => splitbill_item[update] = req.body[update]);
        
        const check_qty = await check_qty_transaction_item(splitbill_item, 'update');
        if(check_qty){
            throw new CustomError('Quantity exceed transaction item', null);
        }
        splitbill_item.updated_by = req.user._id;

        await splitbill_item.save();
        await calculate_splitbill_item(splitbill_item);

        (new ApiResponse(200, true, 'Splitbill Item updated successfully', splitbill_item)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    
    const { id, id_item } = req.params;

    try{
        const splitbill_item = await SplitbillItem.findOneAndDelete({splitbill_id: id,_id: id_item});

        if(!splitbill_item) {
            return next(ApiError.notFound('Splitbill Item not found'));
        }

        (new ApiResponse(200, true, 'Splitbill Item deleted successfully', splitbill_item)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}