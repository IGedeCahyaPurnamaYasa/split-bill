class CustomError {
    constructor(message = 'Error Occured', data = null) {
        // this.code = code;
        // this.message = {
        //     success: false,
        //     message: message,
        //     data: data
        // };
        this.message = message;
        this.errors = data
    }
}

module.exports = CustomError;