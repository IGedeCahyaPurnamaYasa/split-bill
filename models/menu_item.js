const mongoose = require('mongoose');
const MenuType = require('../models/menu_type');
const Company = require('../models/company');
const Schema = mongoose.Schema;

const opts = {
    timestamps: true
};

const menuItemSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'MenuType'
    },
    company_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    price : {
        type: Number,
        default: 0
    },
    image : {
        type: Buffer
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

menuItemSchema.pre('save', async function (next) {
    const menu_item = this;
    if(menu_item.isModified('type_id')){
        const menu_type = await MenuType.findById(menu_item.type_id);
        if(!menu_type){
            throw new Error('Menu Type not found');
        }
    }
    if(menu_item.isModified('company_id')){
        const company = await Company.findById(menu_item.company_id);
        if(!company){
            throw new Error('Company not found');
        }        
    }
    
    next()
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;