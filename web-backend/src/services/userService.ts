import { ApiError, ApiErrorCodes } from 'src/middleware/errorhandler/APIError'
import { dbClient } from 'src/server'
import { UserDao } from '@prisma/client'

/**
 * Get a user from the database by userId; adds the user if it does not exist
 * @param {string} userId the id of the user
 * @returns {UserDto} the corresponding user
 */
export const getUserByAndrewId = async (andrewId: string): Promise<UserDao> => {
  let retrievedUser: UserDao | null = (await dbClient.userDao.findUnique({
    where: {
      andrewId,
    },
  })) as any as UserDao | null

  if (!retrievedUser) {
    retrievedUser = (await dbClient.userDao.create({
      data: {
        andrewId,
      },
    })) as any as UserDao
  }

  return retrievedUser
}

/**
 * Get users from the database by userIds
 * @param andrewIds the ids of the users
 * @returns the corresponding users
 */
export const getUsersByAndrewIds = async (
  andrewIds: string[],
): Promise<UserDao[]> => {
  return dbClient.userDao.findMany({
    where: {
      andrewId: {
        in: andrewIds,
      },
    },
  })
}

/**
 * Remove a user from a team
 * @param {string} andrewId the id of the user
 * @returns {Promise<boolean>}
 */
export const leaveTeam = async (andrewId: string): Promise<boolean> => {
  const teamId = (await getUserByAndrewId(andrewId)).teamDaoGithubUsername
  try {
    await dbClient.userDao.update({
      where: {
        andrewId,
      },
      data: {
        teamDaoGithubUsername: null,
      },
    })

    if (teamId) {
      await dbClient.teamDao.deleteMany({
        where: {
          githubUsername: teamId,
          members: {
            none: {},
          },
        },
      })
    }
  } catch {
    throw new ApiError(
      ApiErrorCodes.BUSINESS_LOGIC_ERROR,
      'Failed to leave team',
    )
  }

  return true
}
