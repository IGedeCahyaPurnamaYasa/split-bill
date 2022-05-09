const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    slug : {
        type: String,
        lowercase: true
    }
})

const slug_options = {
    replacement: '-',
remove: undefined,
    lower: true,
    strict: false,
    locale: 'en',
    trim: true,
  }

permissionSchema.pre('save', async function (next){
    const permission = this;
    permission.slug = slugify(permission.name, slug_options);
    next();
})


const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;