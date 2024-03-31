import { ApiError, ApiErrorCodes } from 'src/middleware/errorhandler/APIError'
import { z } from 'zod'

/**
 * A validator for match IDs
 */
const matchIdValidator = z.string()

/**
 * A validator for limits
 */
const limitValidator = z.number().int().min(0)

/**
 * A validator for offsets
 */
const offsetValidator = z.number().int().min(0)

/**
 * A validator for sort by
 */
const sortByValidator = z
  .string()
  .refine(sortBy => ['timestamp', 'win', 'loose'].includes(sortBy), {
    message: 'Invalid sortBy',
  })

/**
 * A validator for order
 */
const orderValidator = z
  .string()
  .refine(order => ['asc', 'desc'].includes(order), {
    message: 'Invalid order',
  })

/**
 * Validate a match ID
 * @param {string} matchId a match ID to validate
 * @returns {string} the validated match ID
 * @throws {ApiError} if the match ID is invalid
 */
export const validateMatchId = (matchId: string): string => {
  try {
    return matchIdValidator.parse(matchId)
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}

/**
 * Validate an offset
 * @param {number} limit an limit to validate
 * @returns {number} the validated offset
 * @throws {ApiError} if the offset is invalid
 */
export const validateLimit = (limit: number): number => {
  try {
    if (limit) {
      return limitValidator.parse(Number(limit))
    }
    return 10
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}

/**
 * Validate an offset
 * @param {number} offset an offset to validate
 * @returns {number} the validated offset
 * @throws {ApiError} if the offset is invalid
 */
export const validateOffset = (offset: number): number => {
  try {
    if (offset) {
      return offsetValidator.parse(Number(offset))
    }
    return 0
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}

/**
 * Validate a sortBy
 * @param {string} sortBy a sortBy to validate
 * @returns {string} the validated sortBy
 * @throws {ApiError} if the sortBy is invalid
 */
export const validateSortBy = (sortBy: string): string => {
  try {
    if (sortBy) {
      return sortByValidator.parse(sortBy)
    }
    return 'timestamp'
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}

/**
 * Validate an order
 * @param {string} order an order to validate
 * @returns {string} the validated order
 * @throws {ApiError} if the order is invalid
 */
export const validateOrder = (order: string): 'asc' | 'desc' => {
  try {
    if (order) {
      return orderValidator.parse(order) as 'asc' | 'desc'
    }
    return 'desc'
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}
