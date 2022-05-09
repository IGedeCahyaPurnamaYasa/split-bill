const mongoose = require('mongoose');
const Company = require('../models/company');

const Schema = mongoose.Schema;

const discountSchema = new Schema({
    menu_item_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "MenuItem"
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    company_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    discount_rate: {
        type: Number,
        default: 0
    },
    discount_value : {
        type: Number,
        default: 0
    },
    discount_type : {
        type: String,
        enum: ['rate', 'fixed'],
        default: 'fixed'
    },
    start_date_time : {
        type: Date,
        required: true
    },
    end_date_time : {
        type: Date,
        required: true
    }
})

discountSchema.pre('save', async function (next) {
    const discount = this;
    if(discount.isModified('company_id')){
        const company = await Company.findById(discount.company_id);
        if(!company){
            throw new Error('Company not found');
        }        
    }
    
    next()
})

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;