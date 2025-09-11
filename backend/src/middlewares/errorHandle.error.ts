import { NextFunction, Request, Response } from 'express';
import ErrorInterface from '../interfaces/express/error.interface';
import ExpressResponse from '../libs/express/response.libs';

const ErrorHandlingMidelware = (
  err: ErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);
  const {
    status = 500,
    error = 'Internal Server Error',
    errorDev = err.message,
  } = err;
  // ExpressResponse.internalServerError(res, error, errorDev as string);
  res.status(status).json({ error, errorDev });
};

export default ErrorHandlingMidelware;
