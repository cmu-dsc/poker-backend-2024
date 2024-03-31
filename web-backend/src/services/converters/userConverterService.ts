import { UserDto } from '@api/generated'
import { UserDao } from '@prisma/client'

export const convertUserDaoToDto = (userDao: UserDao): UserDto => {
  return {
    teamId:
      userDao.teamDaoGithubUsername == null
        ? undefined
        : userDao.teamDaoGithubUsername,
    andrewId: userDao.andrewId,
  }
}
