const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    }
})

const Company = mongoose.model('Company', companySchema);

module.exports = Company;