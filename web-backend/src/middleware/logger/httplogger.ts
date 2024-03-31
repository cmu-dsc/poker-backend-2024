import { NextFunction, Request, Response } from 'express'
import logger from './logger'

/**
 * Logs the request and response to the console. Slow requests are logged as warnings. Failed requests are logged as errors.
 * @param {Request} req the request to be logged
 * @param {Response} res the to be logged after completing the request
 * @param {NextFunction} next the next function to be called after logging
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, originalUrl } = req
  const start = process.hrtime()

  logger.http(`received\t HTTP ${method} ${originalUrl}`)

  res.on('finish', () => {
    const duration = process.hrtime(start)
    const durationMs = Math.round(duration[0] * 1000 + duration[1] / 1e6)

    if (res.statusCode >= 400) {
      logger.error(
        `failed\t HTTP ${method} ${originalUrl} in ${durationMs}ms with ${res.statusCode}`,
      )
    } else if (durationMs > 500) {
      logger.warn(
        `completed\t HTTP ${method} ${originalUrl} in ${durationMs}ms (slow)`,
      )
    } else {
      logger.http(
        `completed\t HTTP ${method} ${originalUrl} in ${durationMs}ms`,
      )
    }
  })

  next()
}

export default requestLogger
