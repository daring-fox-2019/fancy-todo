const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')

const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
var cors = require('cors')


mongoose.connect('mongodb://localhost/FarciTodo',{useNewUrlParser: true})
require('dotenv').config()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extends:true}))

app.use('/',routes)





app.listen(port, () => console.log(`Example app listening on port ${port}!`))