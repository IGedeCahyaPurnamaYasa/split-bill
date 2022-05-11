const mongoose = require('mongoose');
const Company = require('../models/company');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};

const transactionSchema = new Schema({
    transaction_code : {
        type: String,
        default: function(){
            const date_time = new Date().toLocaleString().split(',');
            const date = date_time[0].replace(/\//g, '');
            const time = date_time[1].trim().replace(/:/g, '');
            return `${process.env.TRANSACTION_CODE_HEAD}-${date}-${time}` ;
        },
        touppercase: true,
        unique: true
    },
    company_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    total: {
        type: Number,
        default: 0
    },
    discount_value : {
        type: Number,
        default: 0
    },
    total_payment : {
        type: Number,
        default: 0
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

transactionSchema.pre('save', async function (next) {
    const transaction = this;

    if(transaction.isModified('company_id')){
        const company = await Company.findById(transaction.company_id);
        if(!company){
            throw new Error('Company not found');
        }        
    }
    
    next()
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;