"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = exports.CustomError = exports.asyncHandler = void 0;
// Async Handler
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            if (error instanceof CustomError) {
                return next(error);
            }
            else if (error instanceof Error) {
                return next(new CustomError(error.message, 500));
            }
            return next(new CustomError("An unknown error occurred", 500));
        });
    };
};
exports.asyncHandler = asyncHandler;
// Custom Error Class
class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.CustomError = CustomError;
// Global Error Handling Middleware
const globalErrorHandling = (err, req, res, next) => {
    if (err) {
        if (process.env.MOOD === "DEV") {
            res.status(err.statusCode || 500).json({
                message: err.message,
                err,
                stack: err.stack,
            });
        }
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};
exports.globalErrorHandling = globalErrorHandling;
