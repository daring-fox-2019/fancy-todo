require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')
const morgan = require('morgan')
const errorHandling = require('./middleware/errorHandling')

app.use(morgan('tiny'))

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.connect(process.env.DB, { useNewUrlParser: true })

mongoose.connection.on('connected', function () {  
    console.log('connect to database');
});

app.use('/', routes)
app.use(errorHandling)

app.listen(process.env.PORT, ()=> {
    console.log(`listen on port ${process.env.PORT}`)
})