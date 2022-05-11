const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};
const menuTypeSchema = new Schema({
    name : {
        type: String,
        required: true
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

const MenuType = mongoose.model('MenuType', menuTypeSchema);

module.exports = MenuType;