const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuTypeSchema = new Schema({
    name : {
        type: String,
        required: true
    }
})

const MenuType = mongoose.model('MenuType', menuTypeSchema);

module.exports = MenuType;