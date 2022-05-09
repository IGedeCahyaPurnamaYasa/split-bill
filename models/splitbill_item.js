const mongoose = require('mongoose');
const Splitbill = require('../models/splitbill');
const Transaction = require('../models/transaction');
const TransactionItem = require('../models/transaction_item');

const Schema = mongoose.Schema;

const splitbillItemSchema = new Schema({
    transaction_item_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TransactionItem"
    },
    splitbill_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Splitbill"
    },
    qty : {
        type: Number,
        default: 0
    },
    total : {
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

splitbillItemSchema.pre('save', async function (next) {
    const splitbill_item = this;

    if(splitbill_item.isModified('splitbill_id')){
        const splitbill = await Splitbill.findById(splitbill_item.splitbill_id);
        if(!splitbill){
            throw new Error('Splitbill not found');
        }
    }

    if(splitbill_item.isModified('transaction_item_id')){
        const transaction_item = await TransactionItem.findById(splitbill_item.transaction_item_id);
        if(!transaction_item){
            throw new Error('Transaction Item not found');
        }        
    }

    if(!splitbill_item.isModified('total')){
        const transaction_item = await TransactionItem.findById(splitbill_item.transaction_item_id);
        splitbill_item.total = transaction_item.price * splitbill_item.qty;
    }

    if(!splitbill_item.isModified('after_discount_value')){
        splitbill_item.after_discount_value = splitbill_item.total;
    }
    
    next();
})

const splitbillItem = mongoose.model('splitbillItem', splitbillItemSchema);

module.exports = splitbillItem;