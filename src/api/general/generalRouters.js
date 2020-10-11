const express = require('express')

const { healthCheck, apiOverview } = require('./generalController')

const general = express.Router()

general.route('/').get(apiOverview)
general.route('/health-check').get(healthCheck)

module.exports = () => general
