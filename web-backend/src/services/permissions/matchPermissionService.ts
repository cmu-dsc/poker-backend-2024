import { ApiError, ApiErrorCodes } from 'src/middleware/errorhandler/APIError'
import { MatchDao, UserDao } from '@prisma/client'
import { getUserByAndrewId } from '../userService'
import { getMatchById } from '../matchService'
import { convertMatchDaoWithTeamMatchDaosToDto } from '../converters/matchConverterService'

export const checkAndrewIdPermissionsForMatch = async (
  andrewId: string,
  matchId: string,
): Promise<boolean> => {
  const user: UserDao = await getUserByAndrewId(andrewId)
  const match: MatchDao = await getMatchById(matchId)

  const matchDto = convertMatchDaoWithTeamMatchDaosToDto(match)

  if (
    user.teamDaoGithubUsername === matchDto.team1Id ||
    user.teamDaoGithubUsername === matchDto.team2Id
  ) {
    return true
  }
  throw new ApiError(
    ApiErrorCodes.FORBIDDEN,
    'User does not have permission to access this match',
  )
}
