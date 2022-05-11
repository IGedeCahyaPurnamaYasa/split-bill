const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;
const opts = {
    timestamps: true
};

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ],
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

roleSchema.pre('save', async function (next){
    const role = this;
    role.slug = slugify(role.name, slug_options);
    next();
})

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
