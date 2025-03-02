import { Request, Response, NextFunction } from "express";

// Async Handler
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((error: unknown) => {
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

// Custom Error Class
export class CustomError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

// Global Error Handling Middleware
export const globalErrorHandling = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
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


