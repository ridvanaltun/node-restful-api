const express = require('express')

const { healthCheck } = require('./generalController')

const general = express.Router()

general.route('/health-check').get(healthCheck)

module.exports = () => general
