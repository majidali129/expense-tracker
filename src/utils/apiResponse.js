export class apiResponse {
    constructor(statusCode, data, message){
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode < 400;
        this.message = message;
    }
}