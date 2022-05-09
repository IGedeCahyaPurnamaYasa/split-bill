class ApiResponse {
    constructor(statusCode, success, message, data) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }

    send(res){
        res.status(this.statusCode).json({
            message: this.message,
            data: this.data,
            success: this.success
        })
    }
    
    static resp(res){
        return (new ApiResponse()).send(res);
    }
}

module.exports = ApiResponse;