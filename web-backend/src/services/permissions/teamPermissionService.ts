import { UserDto } from '@api/generated'
import { ApiError, ApiErrorCodes } from 'src/middleware/errorhandler/APIError'
import { TeamDao, UserDao } from '@prisma/client'
import { getUserByAndrewId } from '../userService'

export const checkUserIdPermissionsForTeamGithubName = async (
  userId: string,
  githubName: string,
): Promise<boolean> => {
  const user: UserDao = await getUserByAndrewId(userId)

  if (user.teamDaoGithubUsername === githubName) {
    return true
  }
  throw new ApiError(
    ApiErrorCodes.FORBIDDEN,
    'User does not have permission to access this team',
  )
}

export const checkAndrewIdPartOfTeamDto = async (
  andrewId: string,
  team: TeamDao & { members?: string[] },
): Promise<boolean> => {
  const user: UserDao = await getUserByAndrewId(andrewId)
  if (user.andrewId && team.members?.includes(user.andrewId)) {
    return true
  }
  throw new ApiError(
    ApiErrorCodes.FORBIDDEN,
    'User has to be part of the team to perform this action',
  )
}
