import * as http from 'http'
import { Storage } from '@google-cloud/storage'
import { PrismaClient } from '@prisma/client'
import logger from './middleware/logger/logger'
import env from './config/env'
import app from './app'

export const dbClient: PrismaClient = new PrismaClient()

export const storageClient = new Storage({
  credentials: JSON.parse(env.GCLOUD_ADMIN_KEY!),
  projectId: 'pokerai-417521',
})

const server = http.createServer(app)
server.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}.`)
})
