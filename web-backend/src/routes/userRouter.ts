import { Router } from 'express'
import { getUserMe, postUserTeamLeave } from 'src/controllers/userController'
import asyncWrapper from 'src/middleware/errorhandler/asyncWrapper'

/**
 * The router for the book resource.
 */
const userRouter = () => {
  const router = Router()

  router.get('/me', asyncWrapper(getUserMe))
  router.post('/team/leave', asyncWrapper(postUserTeamLeave))

  return router
}

export default userRouter
