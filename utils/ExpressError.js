class ExpressError extends Error {
    constructor(message, statusCode, data = null) {
        super();

        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}

module.exports = ExpressError;