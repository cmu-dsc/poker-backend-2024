import { NextFunction, Request, Response } from 'express'
import { ApiError, ApiErrorCodes } from './APIError'
import logger from '../logger/logger'

/**
 * The string representation of an internal server error.
 */
const INTERNAL_SERVER_ERROR_STR = 'Internal Server Error'

/**
 * Custom Error handler middleware for Express.
 * @param error - The error object to handle.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
const errorHandler = (
  error: ApiError, // Update the type of the error parameter
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const status: number = error?.status || ApiErrorCodes.INTERNAL_SERVER_ERROR
  let message = error?.message || INTERNAL_SERVER_ERROR_STR

  if (status === ApiErrorCodes.INTERNAL_SERVER_ERROR) {
    logger.error(error)
    message = INTERNAL_SERVER_ERROR_STR
  }
  res.status(status).send({
    message,
  })
}
export default errorHandler
