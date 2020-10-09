const { logger } = require('../utils')
const loadModels = require('../models')
const mongooseLoader = require('./mongooseLoader')
const agendaLoader = require('./agendaLoader')
const blackListLoader = require('./blackListLoader')

module.exports = async ({ expressApp }) => {
  loadModels()
  logger.info('✔️  Models loaded!')

  await mongooseLoader()
  logger.info('✔️  DB loaded and connected!')

  const blacklist = await blackListLoader()
  logger.info('✔️  Black List loaded!')

  const agenda = agendaLoader()
  logger.info('✔️  Agenda loaded!')

  const expressLoader = require('./expressLoader')
  await expressLoader({ app: expressApp, agenda, blacklist })
  logger.info('✔️  Express loaded')
}
