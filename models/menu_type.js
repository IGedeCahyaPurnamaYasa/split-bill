const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};
const menuTypeSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
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

const slug_options = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'en',
    trim: true,
}

menuTypeSchema.pre('save', async function (next){
    const permission = this;
    permission.slug = slugify(permission.name, slug_options);
    next();
})

const MenuType = mongoose.model('MenuType', menuTypeSchema);

module.exports = MenuType;