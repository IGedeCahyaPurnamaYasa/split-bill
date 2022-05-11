const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const opts = {
    timestamps: true
};

const companySchema = new Schema({
    company_name : {
        type: String,
        required: true
    },
    company_code : {
        type: String,
        required: true
    },
    address : {
        type: String
    },
    country : {
        type: String
    },
    city : {
        type: String
    },
    postal_code : {
        type: String
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company;