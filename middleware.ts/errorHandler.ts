// src/middleware/error-handler.ts

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpError } from '../utils/httpResponse';


export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err);

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            statusCode: err.statusCode
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
};