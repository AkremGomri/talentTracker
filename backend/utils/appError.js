module.exports = class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.msg = message; // add this line to assign the message to a property
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}