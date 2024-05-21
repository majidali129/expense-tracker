export class apiError extends Error {
    constructor(statusCode, message, stack) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.success = false;

        if(stack) {
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}