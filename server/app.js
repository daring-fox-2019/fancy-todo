require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router/index.js')
const cors = require('cors')
const PORT = 4500
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mytodoList', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('connected')
})

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/',router)

app.listen(PORT, function(){
    console.log(`listenin on ${PORT}`)
})

