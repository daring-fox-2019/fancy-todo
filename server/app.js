require('dotenv').config({path: './.env'})
const express = require('express')
const app = express()
const port = 3000
const route = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/fancyTodo',{ useNewUrlParser : true, useFindAndModify: false })

app.use(cors())
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(route)
app.listen(port,() => {
  console.log(`listening on port: ${port}!`)
})