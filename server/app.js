require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const route = require('./routes/index')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/fancytodos',{useNewUrlParser:true})
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())
app.use('/',route)

app.listen(port,() => {
    console.log(`Running on port ${port}`)
})