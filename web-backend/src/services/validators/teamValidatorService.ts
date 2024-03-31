import { TeamDto } from '@api/generated'
import { ApiError, ApiErrorCodes } from 'src/middleware/errorhandler/APIError'
import { z } from 'zod'

/**
 * A validator for team names
 */
const teamNameValidator = z
  .string()
  .min(1)
  .max(39)
  .regex(/^[a-zA-Z0-9-]+$/)

/**
 * A validator for the team dto
 */
const teamValidator = z.object({
  githubUsername: teamNameValidator,
  members: z.array(z.string()).max(4).min(1),
  wins: z.number().int().min(0).optional(),
  losses: z.number().int().min(0).optional(),
})

/**
 * A validator for last x games number
 */
const lastXGamesValidator = z.coerce.number().nullish().transform( x => x ? x : undefined )

/**
 * Validate the last x games number
 * @param {number | undefined} lastXGames the last x games number to validate
 * @throws {ApiError} if parsing fails
 * @returns the parse value
 */
export const validateLastXGames = (
  lastXGames: string | undefined,
): number | undefined => {
  try {
    return lastXGamesValidator.parse(lastXGames)
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}

/**
 * Validate a team
 * @param {TeamDto} team a team to validate
 * @returns {TeamDto} the validated team
 */
export const validateTeam = (team: TeamDto): TeamDto => {
  try {
    return teamValidator.parse(team)
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}

/**
 * Validate a team name
 * @param {string} teamName the team name to validate
 * @returns {string} the validated team name
 */
export const validateTeamName = (teamName: string): string => {
  try {
    return teamNameValidator.parse(teamName)
  } catch (error) {
    throw new ApiError(ApiErrorCodes.BAD_REQUEST, String(error))
  }
}
