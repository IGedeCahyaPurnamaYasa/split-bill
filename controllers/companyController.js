const Company = require('../models/company');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.create = async (req, res, next) => {
    try {
        const company = new Company(req.body);
        await company.save();

        // Send response
        (new ApiResponse(201, true, 'Company created successfully', company)).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.get = async (req, res, next) => {
    const filter = {};
    const sort = {};
    
    if(req.query.company_name){
        filter.company_name = req.query.company_name;
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    const options = {}

    if(req.query.limit){
        options.limit = parseInt(req.query.limit);
        options.skip = parseInt(req.query.skip);
    }

    try {
        const companies = await Company.find(filter, options).sort(sort);

        (new ApiResponse(200, true, 'Data fetched successfully', companies)).send(res);

    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.getById = async (req, res, next) => {
    const _id = req.params.id

    try {
        const company = await Company.findOne({_id: _id});
        if(!company){
            return next(ApiError.notFound('Company not found'))
        }

        (new ApiResponse(200, true, 'Data fetched successfully', company)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}


module.exports.update = async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['company_name', 'company_code', 'address', 'country', 'city', 'postal_code'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return next(ApiError.badRequest('Invalid update'));
    }

    try{
        const company = await Company.findOne({_id: req.params.id});
        
        if(!company){
            return next(ApiError.notFound('Company not found'));
        } 

        updates.forEach((update) => company[update] = req.body[update]);
        
        await company.save();

        (new ApiResponse(200, true, 'Company updated successfully', company)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.delete = async (req, res, next) => {
    const _id = req.params.id;

    try{
        const company = await Company.findOneAndDelete({_id});

        if(!company) {
            return next(ApiError.notFound('Company not found'));
        }

        (new ApiResponse(200, true, 'Company deleted successfully', company)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}