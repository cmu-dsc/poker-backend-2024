import { MatchDto } from '@api/generated'

export const convertMatchDaoWithTeamMatchDaosToDto = (
  matchDao: any,
): MatchDto => {
  if (
    matchDao.teamMatchDaos === undefined ||
    matchDao.teamMatchDaos.length !== 2
  ) {
    throw new Error('Invalid TeamMatchDaos in MatchDao')
  }

  return {
    matchId: matchDao.matchId,
    timestamp: (matchDao.timestamp as Date).toISOString(),
    team1Id: matchDao.teamMatchDaos[0].teamId,
    team2Id: matchDao.teamMatchDaos[1].teamId,
    team1Score: matchDao.teamMatchDaos[0].bankroll,
    team2Score: matchDao.teamMatchDaos[1].bankroll,
  }
}
