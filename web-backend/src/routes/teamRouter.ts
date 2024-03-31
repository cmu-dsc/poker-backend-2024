import { Router } from 'express'
import {
  deleteTeamByGithubUsername,
  getTeam,
  getTeamByGithubUsername,
  postTeam,
  putTeamByGithubUsername,
} from 'src/controllers/teamController'
import asyncWrapper from 'src/middleware/errorhandler/asyncWrapper'

/**
 * The router for the book resource.
 */
const teamRouter = () => {
  const router = Router()

  router.post('/', asyncWrapper(postTeam))
  router.get('/', asyncWrapper(getTeam))
  router.get('/:githubUsername', asyncWrapper(getTeamByGithubUsername))
  router.put('/:githubUsername', asyncWrapper(putTeamByGithubUsername))
  router.delete('/:githubUsername', asyncWrapper(deleteTeamByGithubUsername))

  return router
}

export default teamRouter
