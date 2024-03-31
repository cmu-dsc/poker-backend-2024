/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from 'express'

/**
 * Wrapper to catch errors in async functions and handle them with custom error handler.
 * @param fn the controller function to wrap
 * @returns nothing
 */
const asyncWrapper = (
  fn: (
    req: Request | (Request & { andrewId: string }),
    res: Response<any>,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return (
    req: Request<any, any, any, any>,
    res: Response<any>,
    next: NextFunction,
  ) => {
    fn(req, res, next).catch(next)
  }
}

export default asyncWrapper
