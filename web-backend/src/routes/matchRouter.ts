import { Router } from 'express'
import {
  getMatchByMatchIdLogsBot,
  getMatchByMatchIdLogsEngineCSV,
  getMatchByMatchIdLogsEngineTXT,
  getMatchTeamByGithubUsername,
} from 'src/controllers/matchController'
import asyncWrapper from 'src/middleware/errorhandler/asyncWrapper'

/**
 * The router for the book resource.
 */
const matchRouter = () => {
  const router = Router()

  router.get(
    '/team/:githubUsername',
    asyncWrapper(getMatchTeamByGithubUsername),
  )
  router.get('/:matchId/logs/engine/csv', asyncWrapper(getMatchByMatchIdLogsEngineCSV))
  router.get('/:matchId/logs/engine/txt', asyncWrapper(getMatchByMatchIdLogsEngineTXT))
  router.get('/:matchId/logs/bot', asyncWrapper(getMatchByMatchIdLogsBot))

  return router
}

export default matchRouter
