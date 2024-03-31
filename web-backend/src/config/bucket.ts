import { MatchDao } from '@prisma/client'

export const BUCKET_NAME = 'poker-ai-blobs'
export const MATCH_PREFIX = 'match_'
export const ENGINE_LOG_CSV = 'engine_log.csv'
export const ENGINE_LOG_TXT = 'engine_log.txt'
export const BOT_LOG = 'debug_log.txt'

/**
 * Get the path to the engine log for a match
 * @param {MatchDto} match the match to get the engine log path for
 * @returns {string} the path to the engine log
 */
export const getEngineLogPath = (
  match: MatchDao,
  type: 'csv' | 'txt',
): string => {
  return [
    MATCH_PREFIX + match.matchId,
    type === 'csv' ? ENGINE_LOG_CSV : ENGINE_LOG_TXT,
  ].join('/')
}

/**
 * Get the path to the bot log for a match for a given team
 * @param {MatchDto} match the match to get the log log path for
 * @param {string} teamId the team to get the bot log for
 * @returns {string} the path to the bot log of the given team
 */
export const getBotLogPathTeam = (match: MatchDao, teamId: string): string => {
  return [MATCH_PREFIX + match.matchId, teamId, BOT_LOG].join('/')
}
