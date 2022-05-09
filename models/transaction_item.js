const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const MenuItem = require('../models/menu_item');
const ApiError = require('../utils/error/ApiError');

const Schema = mongoose.Schema;

const transactionItemSchema = new Schema({
    menu_item_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "MenuItem"
    },
    transaction_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Transaction"
    },
    price : {
        type: Number,
        default: 0
    },
    qty : {
        type: Number,
        default: 0
    },
    total : {
        type: Number,
        default: 0
    },
    discount_per_piece : {
        type: Number,
        default: 0
    },
    discount_value : {
        type: Number,
        default: 0
    },
    after_discount_value : {
        type: Number,
        default: 0
    }
})

transactionItemSchema.pre('save', async function (next) {
    const transaction_item = this;

    if(transaction_item.isModified('transaction_id')){
        const transaction = await Transaction.findById(transaction_item.transaction_id);
        if(!transaction){
            throw new Error('Transaction not found');
        }
    }

    if(transaction_item.isModified('menu_item_id')){
        const menu_item = await MenuItem.findById(transaction_item.menu_item_id);
        if(!menu_item){
            throw new Error('Menu Item not found');
        }        
    }

    if(!transaction_item.isModified('total')){
        transaction_item.total = transaction_item.price * transaction_item.qty;
    }

    if(!transaction_item.isModified('after_discount_value')){
        transaction_item.after_discount_value = transaction_item.total;
    }
    
    next();
})

const TransactionItem = mongoose.model('TransactionItem', transactionItemSchema);

module.exports = TransactionItem;