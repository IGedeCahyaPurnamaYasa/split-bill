const mongoose = require('mongoose');
const Transaction = require('../models/transaction');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};

const splitbillSchema = new Schema({
    transaction_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Transaction'
    },
    name: {
        type: String,
        default: 'User'
    },
    created_by : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updated_by : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    created_by : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updated_by : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, opts)

splitbillSchema.pre('save', async function (next) {
    const splitbill = this;

    if(splitbill.isModified('transaction_id')){
        const transaction = await Transaction.findById(splitbill.transaction_id);
        if(!transaction){
            throw new Error('Transaction not found');
        }        
    }
    
    next()
})

const Splitbill = mongoose.model('Splitbill', splitbillSchema);

module.exports = Splitbill;