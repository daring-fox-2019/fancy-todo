const route = require('express').Router()
const {WeatherController} = require('../controllers')
route.get('/:lat/:lon', WeatherController.getWeather)
module.exports = route