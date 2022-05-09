
const CustomError = require('./error/CustomError');
function validateErrorHandler(data) {
    const err = data.validateSync();
    if(err){
        throw new CustomError(err.message, err.errors);
    }
}

module.exports = validateErrorHandler;