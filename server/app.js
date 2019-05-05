require('dotenv').config()

const express = require('express'),
  app = express(),
  port = 3000,
  mongoose = require('mongoose'),
  cors = require('cors'),
  routes = require('./routes/index')

  mongoose.connect('mongodb://localhost:27017/fancy-todos', {useNewUrlParser : true})
  app.use(express.urlencoded({ extended : false }))
  app.use(express.json())
  app.use(cors())

  app.use("/", routes)

  app.listen(port, ()=>{
    console.log('listening on port', port)
  })