class ApiError {
    constructor(code, message = 'Error Occured', data = null) {
        this.code = code;
        this.message = {
            success: false,
            message: message,
            data: data
        };
    }

    static badRequest(msg, data){
        data = (new generateMsg(data)).generateErrorMsg();
        return new ApiError(400, msg, data);
    }

    static notFound(msg = 'Page Not Found'){
        return new ApiError(404, msg);
    }

    static unAuthorized(msg = 'Please Authenticate'){
        return new ApiError(401, msg);
    }

    static internal(msg, data){
        return new ApiError(500, msg, data);
    }
}

class generateMsg {
    constructor(data) {
        this.data = data;
    }

    generateErrorMsg(){
        const msg = {};
        for(let val in this.data){
            msg[val] = this.data[val].message.replace('Path ', '').replace(/`/g, '');
        }
        return msg
    }
}

module.exports = ApiError;