const TransactionItem = require('../models/transaction_item');
const Transaction = require('../models/transaction');
const Discount = require('../models/discount');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        // id transaction
        const {id} = req.params;

        const temp = await TransactionItem.findOne({transaction_id: id, menu_item_id: req.body.menu_item_id});

        if(temp && req.body.menu_item_id){
            throw new Error('This item already added, please update the item');
        }

        let transaction_item = new TransactionItem(req.body);
        
        transaction_item.transaction_id = id;
        transaction_item.created_by = req.user._id;

        await transaction_item.save();
        
        await calculate_discount(transaction_item);
        await calculate_transaction(id);

        
        // Send response
        (new ApiResponse(201, true, 'Transaction Item created successfully', transaction_item)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

const calculate_discount = async (item) => {
    const date_now = new Date();
    const discount = await Discount.findOne({
        menu_item_id: item.menu_item_id, 
        start_date_time: {
            $lte: date_now
        }
    })

    if(discount){
        let discount_value = discount.discount_type === 'fixed' ? discount.discount_value : discount.discount_rate * item.total;
        item.discount_value = discount_value;
        item.after_discount_value -= discount_value;
        item.discount_per_piece = item.discount_value / item.qty;
    }
    
    item.save();
} 

const calculate_transaction = async (id) => {
    
    const transaction = await Transaction.findOne({_id: id});
    const transaction_item = await TransactionItem.aggregate([
        {
            $match: {
                transaction_id : transaction._id
            }
        },
        {
            $group: {
                _id: null,
                discount: {$sum: "$discount_value"},
                total: {$sum: "$total"}
            }
        }
    ])
    
    if(transaction_item){
        transaction.total = 0;
        transaction.discount_value = 0;
        transaction.total_payment = 0;
    }
    else{
        transaction.total = transaction_item[0].total;
        transaction.discount_value = transaction_item[0].discount;
        transaction.total_payment = transaction.total - transaction.discount_value;
    }


    transaction.save();
}

module.exports.get = async (req, res, next) => {
    
    const {id} = req.params

    const filter = {};
    const sort = {};
    
    // set transaction id filter by the transaction_id param
    filter.transaction_id = id;
    
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
        const transaction_item = await TransactionItem.find(filter, include, options)
                    // .populate('transaction_id')
                    .populate('menu_item_id')
                    .sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', transaction_item)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const { id, id_item } = req.params

    try {
        const transaction_item = await TransactionItem.findOne({transaction_id: id, _id: id_item});
        if(!transaction_item){
            return next(ApiError.notFound('Transaction Item not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', transaction_item)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {

    const { id, id_item } = req.params;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['price', 'qty', 'total', 'discount_value', 'item_after_discount', 'updated_at'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        let transaction_item = await TransactionItem.findOne({transaction_id: id,_id: id_item});
        
        if(!transaction_item){
            return next(ApiError.notFound('Transaction Item not found'));
        } 

        updates.forEach((update) => transaction_item[update] = req.body[update]);
        transaction.updated_by = req.user._id;

        await transaction_item.save();

        await calculate_discount(transaction_item);
        await calculate_transaction(id);

        (new ApiResponse(200, true, 'Transaction Item updated successfully', transaction_item)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    
    const { id, id_item } = req.params;

    try{
        const transaction_item = await TransactionItem.findOneAndDelete({transaction_id: id,_id: id_item});

        if(!transaction_item) {
            return next(ApiError.notFound('Transaction Item not found'));
        }

        await calculate_transaction(id);

        (new ApiResponse(200, true, 'Transaction Item deleted successfully', transaction_item)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}