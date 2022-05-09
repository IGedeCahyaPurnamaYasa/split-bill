const User = require('../models/user');
const ApiError = require('../utils/error/ApiError');
const ApiResponse = require('../utils/response/ApiResponse');

module.exports.register = async (req, res, next) => {
    try{
        const user = new User(req.body);
        await user.save();

        const token = await user.generateAuthToken();

        // Send response
        (new ApiResponse(201, true, 'User created successfully', {user, token})).send(res);
    } catch (e){
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.get = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return next(ApiError.notFound('User not found'));
        }
        
        (new ApiResponse(200, true, 'User fetched successfully', user)).send(res);

    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        // Send Response
        (new ApiResponse(200, true, 'Login successfully', {user, token})).send(res);
    } catch (e) {
        next(ApiError.badRequest(e.message, e.errors));
    }
}

module.exports.logout = async (req, res, next) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

        await req.user.save();

        // Send Response
        (new ApiResponse(200, true, 'Logout successfully', null)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}

module.exports.logoutAll = async (req, res, next) => {
    try{
        req.user.tokens = [];
        await req.user.save();

        // Send response
        (new ApiResponse(200, true, 'Logout successfully', null)).send(res);
    } catch (e) {
        next(ApiError.internal(e.message, e.errors));
    }
}
