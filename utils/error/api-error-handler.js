const ApiError = require('./ApiError');

function apiErrorHandler(err, req, res, next){
    if(err instanceof ApiError){
        res.status(err.code).json(err.message);
        return;
    }

    res.status(500).json({
        "success": "false",
        "message": "Something went wrong!",
        "data": null
    });
    
}

module.exports = apiErrorHandler;