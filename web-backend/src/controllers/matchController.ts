import { DownloadLinkDto, MatchDto } from '@api/generated'
import { Request, Response } from 'express'
import { ApiError, ApiErrorCodes } from 'src/middleware/errorhandler/APIError'
import {
  getBotLogDownloadLink,
  getEngineLogDownloadLinkCSV,
  getEngineLogDownloadLinkTXT,
  getMatchesByTeamId,
} from 'src/services/matchService'
import { checkAndrewIdPermissionsForMatch } from 'src/services/permissions/matchPermissionService'
import { checkUserIdPermissionsForTeamGithubName } from 'src/services/permissions/teamPermissionService'
import { getUserByAndrewId } from 'src/services/userService'
import { validateMatchId } from 'src/services/validators/matchValidatorService'
import { validateTeamName } from 'src/services/validators/teamValidatorService'
import { UserDao } from '@prisma/client'

/**
 * Get all matches for a team by the team id (github username)
 * @param {Request<any, any, any, any>} req the request containing the team id
 * @param {Response<MatchDto[]>} res the response containing the matches
 */
export const getMatchTeamByGithubUsername = async (
  req: Request<any, any, any, any> & { andrewId?: string },
  res: Response<MatchDto[]>,
) => {
  const githubName: string = validateTeamName(req.params.githubUsername)

  await checkUserIdPermissionsForTeamGithubName(req.andrewId!, githubName)

  const matches: MatchDto[] = await getMatchesByTeamId(githubName)

  res.status(200).json(matches)
}

/**
 * Get the engine CSV logs for a match by the match id
 * @param {Request<any, any, any, any>} req the request containing the match id
 * @param {Response<DownloadLinkDto>} res the response containing the engine logs download link
 */
export const getMatchByMatchIdLogsEngineCSV = async (
  req: Request<any, any, any, any> & { andrewId?: string },
  res: Response<DownloadLinkDto>,
) => {
  const matchId: string = validateMatchId(req.params.matchId)

  await checkAndrewIdPermissionsForMatch(req.andrewId!, matchId)

  const downloadUrlCSV: string = await getEngineLogDownloadLinkCSV(matchId)

  res
    .status(200)
    .json({ downloadUrl: downloadUrlCSV, filetype: 'csv' } as DownloadLinkDto)
}

/**
 * Get the engine TXT logs for a match by the match id
 * @param {Request<any, any, any, any>} req the request containing the match id
 * @param {Response<DownloadLinkDto>} res the response containing the engine logs download link
 */
export const getMatchByMatchIdLogsEngineTXT = async (
  req: Request<any, any, any, any> & { andrewId?: string },
  res: Response<DownloadLinkDto>,
) => {
  const matchId: string = validateMatchId(req.params.matchId)

  await checkAndrewIdPermissionsForMatch(req.andrewId!, matchId)

  const downloadUrlTXT: string = await getEngineLogDownloadLinkTXT(matchId)

  res
    .status(200)
    .json({ downloadUrl: downloadUrlTXT, filetype: 'txt' } as DownloadLinkDto)
}

/**
 * Get the bot logs for a match by the match id
 * @param {Request<any, any, any, any>} req the request containing the match id
 * @param {Response<DownloadLinkDto>} res the response containing the bot logs download link
 */
export const getMatchByMatchIdLogsBot = async (
  req: Request<any, any, any, any> & { andrewId?: string },
  res: Response<DownloadLinkDto>,
) => {
  const matchId: string = validateMatchId(req.params.matchId)

  await checkAndrewIdPermissionsForMatch(req.andrewId!, req.params.matchId)

  const user: UserDao = await getUserByAndrewId(req.andrewId!)
  if (!user.teamDaoGithubUsername) {
    throw new ApiError(
      ApiErrorCodes.FORBIDDEN,
      'User does not have permission to access this match',
    )
  }
  const downloadUrl: string = await getBotLogDownloadLink(
    matchId,
    user.teamDaoGithubUsername,
  )

  res.status(200).json({ downloadUrl, filetype: 'txt' } as DownloadLinkDto)
}
